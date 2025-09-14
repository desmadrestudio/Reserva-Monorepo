// app/routes/services.new.tsx
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useNavigation, Form } from "@remix-run/react";
import { useState } from "react";
import { Page, Layout, Card, TextField, Checkbox, Button, InlineStack, BlockStack, Text, Select } from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";
import { dollarsToCents } from "~/utils/money";

export const loader = async (_: LoaderFunctionArgs) => json({});

function parseNumber(v: FormDataEntryValue | null, fallback = 0) {
  const n = Number(v ?? "");
  return Number.isFinite(n) ? n : fallback;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();

  const name = String(fd.get("name") || "").trim();
  const category = String(fd.get("category") || "").trim() || null;
  const basePriceDollars = parseNumber(fd.get("basePrice"), 0);
  const baseMinutes = parseNumber(fd.get("baseMinutes"), 60);
  const active = fd.get("active") === "on";
  const processingEnabled = fd.get("processingEnabled") === "on";
  const processingMinutes = processingEnabled ? parseNumber(fd.get("processingMinutes"), 0) : 0;
  const blockExtraEnabled = fd.get("blockExtraEnabled") === "on";
  const blockExtraMinutes = blockExtraEnabled ? parseNumber(fd.get("blockExtraMinutes"), 0) : 0;
  const requiresResource = fd.get("requiresResource") === "on";
  const bookableOnline = fd.get("bookableOnline") === "on";
  const displayPriceNote = String(fd.get("displayPriceNote") || "").trim() || null;
  const taxable = (fd.get("taxable") || "nontax").toString() === "taxable";

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (basePriceDollars < 0) errors.basePrice = "Price must be ≥ 0.";
  if (baseMinutes <= 0) errors.baseMinutes = "Duration must be > 0.";
  if (processingMinutes < 0) errors.processingMinutes = "Must be ≥ 0";
  if (blockExtraMinutes < 0) errors.blockExtraMinutes = "Must be ≥ 0";

  if (Object.keys(errors).length) {
    return json({ ok: false, errors }, { status: 400 });
  }

  await prisma.service.create({
    data: {
      name,
      category,
      basePrice: dollarsToCents(basePriceDollars),
      baseMinutes,
      active,
      processingMinutes,
      blockExtraMinutes,
      requiresResource,
      bookableOnline,
      displayPriceNote,
      taxable,
    },
    select: { id: true },
  });

  return redirect("/services");
};

export default function NewService() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>() as any;
  const loading = nav.state === "submitting";
  const [active, setActive] = useState(true);
  const [processingEnabled, setProcessingEnabled] = useState(false);
  const [processingMinutes, setProcessingMinutes] = useState("0");
  const [blockExtraEnabled, setBlockExtraEnabled] = useState(false);
  const [blockExtraMinutes, setBlockExtraMinutes] = useState("0");
  const [requiresResource, setRequiresResource] = useState(true);
  const [bookableOnline, setBookableOnline] = useState(true);
  const [displayPriceNote, setDisplayPriceNote] = useState("");
  const [taxOption, setTaxOption] = useState("nontax");

  return (
    <Page
      title="Create Service"
      primaryAction={{
        content: "Save",
        onAction: () => {
          if (typeof window !== "undefined") {
            (document.getElementById("service-form") as HTMLFormElement | null)?.requestSubmit();
          }
        },
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Form method="post" id="service-form">
              <BlockStack gap="400">
                {/* Image tile placeholder */}
                <BlockStack gap="100">
                  <Text as="p" tone="subdued">Tap tile to edit.</Text>
                  {/* TODO: Integrate image upload & storage */}
                </BlockStack>

                <TextField label="Name" name="name" error={actionData?.errors?.name} autoFocus autoComplete="off" />
                <TextField label="Category" name="category" helpText="(optional)" autoComplete="off" />
                <TextField label="Price (USD)" name="basePrice" type="number" error={actionData?.errors?.basePrice} autoComplete="off" />
                <TextField label="Duration (minutes)" name="baseMinutes" type="number" error={actionData?.errors?.baseMinutes} autoComplete="off" />

                <Checkbox label="Add processing time" checked={processingEnabled} onChange={(v) => setProcessingEnabled(!!v)} />
                {processingEnabled && (
                  <TextField
                    label="Processing minutes"
                    name="processingMinutes"
                    type="number"
                    value={processingMinutes}
                    onChange={(v) => setProcessingMinutes(v)}
                    error={actionData?.errors?.processingMinutes}
                  />
                )}
                <input type="hidden" name="processingEnabled" value="on" disabled={!processingEnabled} />

                <Checkbox label="Block Extra Time" checked={blockExtraEnabled} onChange={(v) => setBlockExtraEnabled(!!v)} />
                {blockExtraEnabled && (
                  <TextField
                    label="Extra minutes blocked"
                    name="blockExtraMinutes"
                    type="number"
                    value={blockExtraMinutes}
                    onChange={(v) => setBlockExtraMinutes(v)}
                    helpText="Extra time will be blocked for cleanup, transition, etc."
                    error={actionData?.errors?.blockExtraMinutes}
                  />
                )}
                <input type="hidden" name="blockExtraEnabled" value="on" disabled={!blockExtraEnabled} />

                <Text as="h3" variant="headingSm">Resources</Text>
                <Checkbox label="Resource required for this service" checked={requiresResource} onChange={(v) => setRequiresResource(!!v)} />
                <input type="hidden" name="requiresResource" value="on" disabled={!requiresResource} />
                {/* TODO: Assigned resources picker */}

                <Text as="h3" variant="headingSm">Online Booking</Text>
                <Checkbox label="Bookable by Customers Online" checked={bookableOnline} onChange={(v) => setBookableOnline(!!v)} />
                <input type="hidden" name="bookableOnline" value="on" disabled={!bookableOnline} />
                {/* TODO: Assigned Team Members (provider linking) */}
                <TextField label="Display Price" name="displayPriceNote" value={displayPriceNote} onChange={(v) => setDisplayPriceNote(v)} placeholder="E.g. Call Us" helpText="Optional: clarify pricing details for online booking." />

                <Text as="h3" variant="headingSm">Taxes</Text>
                <Select
                  label="Tax treatment"
                  name="taxable"
                  options={[
                    { label: "Nontaxable", value: "nontax" },
                    { label: "Taxable", value: "taxable" },
                  ]}
                  value={taxOption}
                  onChange={(v) => setTaxOption(v)}
                />

                <Checkbox
                  label="Active (visible to staff & online)"
                  checked={active}
                  onChange={(checked) => setActive(checked)}
                />
                <input type="hidden" name="active" value="on" disabled={!active} />
                <InlineStack align="end" gap="200">
                  <Button url="/services">Cancel</Button>
                  <Button submit loading={loading}>Save</Button>
                </InlineStack>
              </BlockStack>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
