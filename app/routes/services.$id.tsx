import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, useRouteError, Link as RemixLink } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  TextField,
  Button,
  IndexTable,
  Select,
  Banner,
  Checkbox,
  Toast,
} from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";
import { centsToDollars, dollarsToCents } from "~/utils/money";
import { useEffect, useState } from "react";

type LoaderData = {
  svc: {
    id: string;
    name: string;
    basePrice: number;
    baseMinutes: number;
    category: string | null;
    active: boolean;
    bookableOnline: boolean;
    requiresResource: boolean;
    processingMinutes: number;
    blockExtraMinutes: number;
    displayPriceNote: string | null;
    taxable: boolean;
    updatedAt: Date | null;
  };
  durations: Array<{
    id: string;
    minutes: number;
    label: string | null;
    priceDelta: number; // cents
  }>;
  addOns: Array<{
    id: string;
    name: string;
    price: number; // cents
    active: boolean;
  }>;
  availableAddOns: Array<{ id: string; name: string; price: number }>;
  resources: Array<{ id: string; name: string }>;
  availableResources: Array<{ id: string; name: string }>;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id as string | undefined;
  if (!id) throw new Response("Missing id", { status: 400 });

  const svc = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      basePrice: true,
      baseMinutes: true,
      category: true,
      active: true,
      bookableOnline: true,
      requiresResource: true,
      processingMinutes: true,
      blockExtraMinutes: true,
      displayPriceNote: true,
      taxable: true,
      updatedAt: true,
    },
  });
  if (!svc) throw new Response("Not found", { status: 404 });

  const durations = await prisma.serviceDuration.findMany({
    where: { serviceId: id },
    orderBy: [{ minutes: "asc" }],
    select: {
      id: true,
      minutes: true,
      label: true,
      priceDelta: true,
    },
  });

  // Attached add-ons for this service
  const addOns = await prisma.addOn.findMany({
    where: { services: { some: { id } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, price: true, active: true },
  });
  const attachedIds = addOns.map((a) => a.id);
  const availableAddOns = await prisma.addOn.findMany({
    where: attachedIds.length ? { id: { notIn: attachedIds } } : undefined,
    orderBy: { name: "asc" },
    take: 20,
    select: { id: true, name: true, price: true },
  });

  // Resources linked to this service
  const resourceLinks = await prisma.serviceResource.findMany({
    where: { serviceId: id },
    include: { resource: { select: { id: true, name: true } } },
    orderBy: { resourceId: "asc" },
  });
  const resources = resourceLinks.map((r) => r.resource);
  const attachedResIds = resources.map((r) => r.id);
  const availableResources = await prisma.resource.findMany({
    where: attachedResIds.length ? { id: { notIn: attachedResIds } } : undefined,
    orderBy: { name: "asc" },
    take: 20,
    select: { id: true, name: true },
  });

  return json<LoaderData>({ svc, durations, addOns, availableAddOns, resources, availableResources });
}

function toCents(dollarsLike: string): number {
  const dollars = Number((dollarsLike || "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(dollars) ? Math.round(dollars * 100) : 0;
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = params.id as string | undefined;
  if (!id) throw new Response("Missing id", { status: 400 });
  const fd = await request.formData();
  const intent = String(fd.get("_intent") || "");

  if (intent === "updateService") {
    const name = (fd.get("name")?.toString() || "").trim();
    const category = (fd.get("category")?.toString() || "").trim() || null;
    const basePriceInput = fd.get("basePrice")?.toString() || "0";
    const baseMinutesStr = fd.get("baseMinutes")?.toString() || "0";
    const active = fd.get("active")?.toString() === "on";
    const bookableOnline = fd.get("bookableOnline")?.toString() === "on";
    const requiresResource = fd.get("requiresResource")?.toString() === "on";
    const processingEnabled = fd.get("processingEnabled")?.toString() === "on";
    const processingMinutesStr = fd.get("processingMinutes")?.toString() || "0";
    const blockExtraEnabled = fd.get("blockExtraEnabled")?.toString() === "on";
    const blockExtraMinutesStr = fd.get("blockExtraMinutes")?.toString() || "0";
    const displayPriceNote = (fd.get("displayPriceNote")?.toString() || "").trim() || null;
    const taxable = (fd.get("taxable")?.toString() || "nontax") === "taxable";

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required";
    const baseMinutes = Number(baseMinutesStr);
    if (!Number.isFinite(baseMinutes) || baseMinutes <= 0) errors.baseMinutes = "Duration must be > 0";
    const basePrice = dollarsToCents(basePriceInput);
    if (basePrice < 0) errors.basePrice = "Price must be ≥ 0";
    const processingMinutes = processingEnabled ? Number(processingMinutesStr) : 0;
    if (processingMinutes < 0 || !Number.isFinite(processingMinutes)) errors.processingMinutes = "Must be ≥ 0";
    const blockExtraMinutes = blockExtraEnabled ? Number(blockExtraMinutesStr) : 0;
    if (blockExtraMinutes < 0 || !Number.isFinite(blockExtraMinutes)) errors.blockExtraMinutes = "Must be ≥ 0";
    if (Object.keys(errors).length) return json({ ok: false, form: "updateService", errors }, { status: 400 });

    await prisma.service.update({
      where: { id },
      data: {
        name,
        category,
        basePrice,
        baseMinutes,
        active,
        bookableOnline,
        requiresResource,
        processingMinutes,
        blockExtraMinutes,
        displayPriceNote,
        taxable,
      },
    });
    return redirect(`/services/${id}?ok=updated`);
  }

  if (intent === "deleteService") {
    await prisma.service.delete({ where: { id } });
    return redirect("/services");
  }

  // Accept a couple of intent spellings for ergonomics
  const isCreate = ["createDuration", "add-duration", "create"].includes(intent);
  const isDelete = ["deleteDuration", "delete-duration", "delete"].includes(intent);

  if (isCreate) {
    const minutes = Number(fd.get("minutes") ?? "");
    const label = (fd.get("label")?.toString() || "").trim() || null;
    const priceDeltaCents = toCents(fd.get("priceDelta")?.toString() || "0");

    const errors: Record<string, string> = {};
    if (!Number.isFinite(minutes) || minutes <= 0) errors.minutes = "Minutes must be > 0";
    if (Object.keys(errors).length) return json({ ok: false, errors }, { status: 400 });

    await prisma.serviceDuration.create({
      data: { serviceId: id, minutes, label, priceDelta: priceDeltaCents },
    });
    return redirect(`/services/${id}`);
  }

  if (isDelete) {
    const durationId = fd.get("durationId")?.toString();
    if (!durationId) return json({ ok: false, error: "Missing durationId" }, { status: 400 });
    await prisma.serviceDuration.delete({ where: { id: durationId } });
    return redirect(`/services/${id}`);
  }

  // Add-on intents
  if (intent === "createAddOn") {
    const name = (fd.get("name")?.toString() || "").trim();
    const priceDelta = toCents(fd.get("priceDelta")?.toString() || "0");
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required";
    if (Object.keys(errors).length) return json({ ok: false, errors }, { status: 400 });
    const addon = await prisma.addOn.create({ data: { name, price: priceDelta, minutes: 0, active: true } });
    await prisma.service.update({ where: { id }, data: { addons: { connect: { id: addon.id } } } });
    return redirect(`/services/${id}`);
  }

  if (intent === "attachAddOn") {
    const addOnId = fd.get("addOnId")?.toString();
    if (!addOnId) return json({ ok: false, errors: { addOnId: "Select an add-on" } }, { status: 400 });
    await prisma.service.update({ where: { id }, data: { addons: { connect: { id: addOnId } } } });
    return redirect(`/services/${id}`);
  }

  if (intent === "detachAddOn") {
    const addOnId = fd.get("addOnId")?.toString();
    if (!addOnId) return json({ ok: false, error: "Missing addOnId" }, { status: 400 });
    await prisma.service.update({ where: { id }, data: { addons: { disconnect: { id: addOnId } } } });
    return redirect(`/services/${id}`);
  }

  // Online booking toggles
  if (intent === "toggleBookable") {
    const current = await prisma.service.findUnique({ where: { id }, select: { bookableOnline: true } });
    await prisma.service.update({ where: { id }, data: { bookableOnline: !current?.bookableOnline } });
    return redirect(`/services/${id}?ok=bookable`);
  }
  if (intent === "toggleRequiresResource") {
    const current = await prisma.service.findUnique({ where: { id }, select: { requiresResource: true } });
    await prisma.service.update({ where: { id }, data: { requiresResource: !current?.requiresResource } });
    return redirect(`/services/${id}?ok=requiresResource`);
  }

  // Resource attach/detach
  if (intent === "attachResource") {
    const resourceId = fd.get("resourceId")?.toString();
    if (!resourceId) return json({ ok: false, errors: { resourceId: "Select a resource" } }, { status: 400 });
    await prisma.serviceResource.create({ data: { serviceId: id, resourceId } });
    return redirect(`/services/${id}?ok=attachResource`);
  }
  if (intent === "detachResource") {
    const resourceId = fd.get("resourceId")?.toString();
    if (!resourceId) return json({ ok: false, error: "Missing resourceId" }, { status: 400 });
    await prisma.serviceResource.deleteMany({ where: { serviceId: id, resourceId } });
    return redirect(`/services/${id}?ok=detachResource`);
  }

  return json({ ok: false, error: "Unknown intent" }, { status: 400 });
}

export default function ServiceDurationsPage() {
  const { svc, durations, addOns, availableAddOns, resources, availableResources } = useLoaderData<LoaderData>();
  const nav = useNavigation();
  const actionData = useActionData<typeof action>() as any;
  const adding = nav.state === "submitting" && (nav.formData?.get("_intent") === "createDuration" || nav.formData?.get("_intent") === "add-duration");
  const creatingAddon = nav.state === "submitting" && nav.formData?.get("_intent") === "createAddOn";
  const attachingAddon = nav.state === "submitting" && nav.formData?.get("_intent") === "attachAddOn";
  const attachingResource = nav.state === "submitting" && nav.formData?.get("_intent") === "attachResource";

  const [toast, setToast] = useState<string | null>(null);
  const [name, setName] = useState(svc.name);
  const [category, setCategory] = useState(svc.category ?? "");
  const [priceDollars, setPriceDollars] = useState(String(centsToDollars(svc.basePrice ?? 0)));
  const [minutes, setMinutes] = useState(String(svc.baseMinutes ?? 0));
  const [active, setActive] = useState(!!svc.active);
  const [bookable, setBookable] = useState(!!svc.bookableOnline);
  const [processingEnabled, setProcessingEnabled] = useState(!!svc.processingMinutes);
  const [processingMinutes, setProcessingMinutes] = useState(String(svc.processingMinutes || 0));
  const [blockExtraEnabled, setBlockExtraEnabled] = useState(!!svc.blockExtraMinutes);
  const [blockExtraMinutes, setBlockExtraMinutes] = useState(String(svc.blockExtraMinutes || 0));
  const [displayPriceNote, setDisplayPriceNote] = useState(svc.displayPriceNote || "");
  const [taxOption, setTaxOption] = useState(svc.taxable ? "taxable" : "nontax");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const ok = sp.get("ok");
      if (ok) {
        const map: Record<string, string> = {
          bookable: "Online booking updated",
          requiresResource: "Resource requirement updated",
          attachResource: "Resource attached",
          detachResource: "Resource removed",
          updated: "Service updated",
        };
        setToast(map[ok] || "Saved");
        sp.delete("ok");
        const url = window.location.pathname + (sp.toString() ? `?${sp}` : "");
        window.history.replaceState(null, "", url);
      }
    }
  }, []);

  return (
    <Page
      title={`Service: ${svc.name}`}
      backAction={{ url: "/services" }}
      primaryAction={{
        content: "Save",
        onAction: () => {
          if (typeof window !== "undefined") {
            (document.getElementById("svc-edit-form") as HTMLFormElement | null)?.requestSubmit();
          }
        },
      }}
    >
      {toast && <Toast content={toast} onDismiss={() => setToast(null)} />}
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Service Details</Text>
              <Form method="post" replace id="svc-edit-form">
                <input type="hidden" name="_intent" value="updateService" />
                <BlockStack gap="200">
                  <TextField label="Name" name="name" value={name} onChange={(v) => setName(v)} autoComplete="off" error={actionData?.form === "updateService" ? actionData?.errors?.name : undefined} />
                  <TextField label="Category" name="category" value={category} onChange={(v) => setCategory(v)} autoComplete="off" />
                  <InlineStack gap="200">
                    <TextField label="Base price (USD)" name="basePrice" type="number" value={priceDollars} onChange={(v) => setPriceDollars(v)} autoComplete="off" error={actionData?.form === "updateService" ? actionData?.errors?.basePrice : undefined} />
                    <TextField label="Default minutes" name="baseMinutes" type="number" value={minutes} onChange={(v) => setMinutes(v)} autoComplete="off" error={actionData?.form === "updateService" ? actionData?.errors?.baseMinutes : undefined} />
                  </InlineStack>
                  <InlineStack gap="400">
                    <Checkbox label="Active" checked={active} onChange={(v) => setActive(v)} />
                    <Checkbox label="Bookable online" checked={bookable} onChange={(v) => setBookable(v)} />
                  </InlineStack>
                  <input type="hidden" name="active" value="on" disabled={!active} />
                  <input type="hidden" name="bookableOnline" value="on" disabled={!bookable} />
                  <Checkbox label="Add processing time" checked={processingEnabled} onChange={(v) => setProcessingEnabled(!!v)} />
                  {processingEnabled && (
                    <TextField label="Processing minutes" name="processingMinutes" type="number" value={processingMinutes} onChange={(v) => setProcessingMinutes(v)} />
                  )}
                  <input type="hidden" name="processingEnabled" value="on" disabled={!processingEnabled} />
                  <Checkbox label="Block Extra Time" checked={blockExtraEnabled} onChange={(v) => setBlockExtraEnabled(!!v)} />
                  {blockExtraEnabled && (
                    <TextField label="Extra minutes blocked" name="blockExtraMinutes" type="number" value={blockExtraMinutes} onChange={(v) => setBlockExtraMinutes(v)} helpText="Extra time will be blocked for clean up, transition, etc." />
                  )}
                  <input type="hidden" name="blockExtraEnabled" value="on" disabled={!blockExtraEnabled} />
                  <Text as="h3" variant="headingSm">Online Booking</Text>
                  <TextField label="Display Price" name="displayPriceNote" value={displayPriceNote} onChange={(v) => setDisplayPriceNote(v)} placeholder="E.g. Call Us" helpText="Optional: clarify pricing details for customers booking online." />
                  <Text as="h3" variant="headingSm">Taxes</Text>
                  <Select label="Tax treatment" name="taxable" options={[{ label: "Nontaxable", value: "nontax" }, { label: "Taxable", value: "taxable" }]} value={taxOption} onChange={(v) => setTaxOption(v)} />
                  <InlineStack align="end" gap="200">
                    <Button submit loading={nav.state === "submitting" && nav.formData?.get("_intent") === "updateService"}>Save</Button>
                    <Form method="post" replace>
                      <input type="hidden" name="_intent" value="deleteService" />
                      <Button tone="critical" submit>Delete Service</Button>
                    </Form>
                  </InlineStack>
                </BlockStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap='300'>
              <Text as='h2' variant='headingMd'>Online Booking</Text>
              <Form method='post' replace id='tg-book-form'>
                <input type='hidden' name='_intent' value='toggleBookable' />
                <Checkbox
                  label='Bookable by Customers Online'
                  checked={svc.bookableOnline}
                  onChange={() => {
                    (document.getElementById('tg-book-submit') as HTMLButtonElement)?.click();
                  }}
                />
                <button id='tg-book-submit' type='submit' hidden />
              </Form>
              <Text as='p' tone='subdued'>Assigned Team Members: All Team Members</Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap='300'>
              <Text as='h2' variant='headingMd'>Resources</Text>

              <Form method='post' replace id='tg-res-form'>
                <input type='hidden' name='_intent' value='toggleRequiresResource' />
                <Checkbox
                  label='Resource required for this service'
                  checked={svc.requiresResource}
                  onChange={() => {
                    (document.getElementById('tg-res-submit') as HTMLButtonElement)?.click();
                  }}
                />
                <button id='tg-res-submit' type='submit' hidden />
              </Form>

              {resources.length === 0 ? (
                <Text as="p" tone="subdued">No resources attached.</Text>
              ) : (
                <IndexTable
                  resourceName={{ singular: "resource", plural: "resources" }}
                  itemCount={resources.length}
                  selectable={false}
                  condensed
                  headings={[{ title: "Name" }, { title: "" }]}
                >
                  {resources.map((r, i) => (
                    <IndexTable.Row id={r.id} key={r.id} position={i}>
                      <IndexTable.Cell>{r.name}</IndexTable.Cell>
                      <IndexTable.Cell>
                        <Form method="post" replace>
                          <input type="hidden" name="_intent" value="detachResource" />
                          <input type="hidden" name="resourceId" value={r.id} />
                          <Button tone="critical" variant="plain" submit>Remove</Button>
                        </Form>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  ))}
                </IndexTable>
              )}

              <Text as="h3" variant="headingSm">Attach resource</Text>
              <Form method="post" replace>
                <input type="hidden" name="_intent" value="attachResource" />
                <InlineStack gap="200" align="start">
                  <Select
                    label="Resource"
                    name="resourceId"
                    options={[{ label: "Select resource", value: "" }, ...availableResources.map((o) => ({ label: o.name, value: o.id }))]}
                  />
                  <Button submit loading={attachingResource}>Attach</Button>
                </InlineStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
            
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Durations</Text>
              <IndexTable
                resourceName={{ singular: "duration", plural: "durations" }}
                itemCount={(durations?.length ?? 0) + 1}
                selectable={false}
                headings={[
                  { title: "Minutes" },
                  { title: "Label" },
                  { title: "Price delta" },
                  { title: "Actions" },
                ]}
              >
                {/* Inline add row */}
                <IndexTable.Row id="__add" position={0} key="__add">
                  <IndexTable.Cell>
                    <Form method="post" replace>
                      <InlineStack align="start" gap="200">
                        <input type="hidden" name="_intent" value="createDuration" />
                        <TextField labelHidden label="Minutes" name="minutes" type="number" min={1} autoComplete="off" />
                        <TextField labelHidden label="Label" name="label" autoComplete="off" placeholder="e.g., Deluxe" />
                        <TextField labelHidden label="Price delta" name="priceDelta" type="number" prefix="$" autoComplete="off" placeholder="0.00" />
                        <Button submit loading={adding}>Add</Button>
                      </InlineStack>
                    </Form>
                  </IndexTable.Cell>
                  <IndexTable.Cell />
                  <IndexTable.Cell />
                  <IndexTable.Cell />
                </IndexTable.Row>

                {(durations || []).map((d, idx) => (
                  <IndexTable.Row id={d.id} key={d.id} position={idx + 1}>
                    <IndexTable.Cell>{d.minutes}</IndexTable.Cell>
                    <IndexTable.Cell>{d.label ?? "—"}</IndexTable.Cell>
                    <IndexTable.Cell>
                      {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format((d.priceDelta ?? 0) / 100)}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Form method="post" replace>
                        <input type="hidden" name="_intent" value="deleteDuration" />
                        <input type="hidden" name="durationId" value={d.id} />
                        <Button tone="critical" variant="plain" submit>
                          Delete
                        </Button>
                      </Form>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>

              <Text as="p" tone="subdued">
                Tip: Price delta adjusts the base price for this duration.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Add-ons</Text>

              {addOns.length === 0 ? (
                <Text as="p" tone="subdued">No add-ons attached.</Text>
              ) : (
                <IndexTable
                  resourceName={{ singular: "add-on", plural: "add-ons" }}
                  itemCount={addOns.length}
                  selectable={false}
                  condensed
                  headings={[{ title: "Name" }, { title: "Price" }, { title: "" }]}
                >
                  {addOns.map((a, i) => (
                    <IndexTable.Row id={a.id} key={a.id} position={i}>
                      <IndexTable.Cell>{a.name}</IndexTable.Cell>
                      <IndexTable.Cell>
                        {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format((a.price ?? 0) / 100)}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Form method="post" replace>
                          <input type="hidden" name="_intent" value="detachAddOn" />
                          <input type="hidden" name="addOnId" value={a.id} />
                          <Button tone="critical" variant="plain" submit>
                            Remove
                          </Button>
                        </Form>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  ))}
                </IndexTable>
              )}

              <Text as="h3" variant="headingSm">Create new add-on</Text>
              {actionData?.errors?.name && <Banner tone="critical">{actionData.errors.name}</Banner>}
              <Form method="post" replace>
                <input type="hidden" name="_intent" value="createAddOn" />
                <InlineStack gap="200" align="start">
                  <TextField label="Name" name="name" error={actionData?.errors?.name} autoComplete="off" />
                  <TextField label="Price delta" name="priceDelta" type="number" prefix="$" autoComplete="off" />
                  <Button submit loading={creatingAddon}>Add</Button>
                </InlineStack>
              </Form>

              <Text as="h3" variant="headingSm">Attach existing</Text>
              <Form method="post" replace>
                <input type="hidden" name="_intent" value="attachAddOn" />
                <InlineStack gap="200" align="start">
                  <Select
                    label="Add-on"
                    name="addOnId"
                    options={[
                      { label: "Select add-on", value: "" },
                      ...availableAddOns.map((o) => ({
                        label: `${o.name} (${Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format((o.price ?? 0) / 100)})`,
                        value: o.id,
                      })),
                    ]}
                  />
                  <Button submit loading={attachingAddon}>Attach</Button>
                </InlineStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary() {
  const err = useRouteError() as any;
  const message = (typeof err === "string" && err) || err?.message || "Something went wrong.";
  return (
    <Page title="Service">
      <Card>
        <Text as="h2" variant="headingMd">Route error</Text>
        <pre style={{ whiteSpace: "pre-wrap" }}>{message}</pre>
      </Card>
    </Page>
  );
}

export function CatchBoundary() {
  return (
    <Page title="Not found">
      <Card>
        <Text as="p">Page not found.</Text>
        <RemixLink to="/services">Back to services</RemixLink>
      </Card>
    </Page>
  );
}
