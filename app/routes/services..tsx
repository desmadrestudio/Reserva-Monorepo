import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";

function n(v: FormDataEntryValue | null, fb = 0) {
  const num = Number(v ?? "");
  return Number.isFinite(num) ? num : fb;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;
  const svc = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      category: true,
      basePrice: true,
      baseMinutes: true,
      active: true,
      updatedAt: true,
    },
  });
  if (!svc) throw new Response("Not found", { status: 404 });
  return json({ svc });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = params.id!;
  const fd = await request.formData();
  const intent = String(fd.get("_intent") || "save");

  if (intent === "delete") {
    await prisma.service.delete({ where: { id } });
    return redirect("/services");
  }

  const name = String(fd.get("name") || "").trim();
  const category = String(fd.get("category") || "").trim() || null;
  const basePrice = n(fd.get("basePrice"), 0);
  const baseMinutes = n(fd.get("baseMinutes"), 60);
  const active = fd.get("active") === "on";

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (basePrice < 0) errors.basePrice = "Price must be ≥ 0.";
  if (baseMinutes <= 0) errors.baseMinutes = "Duration must be > 0.";
  if (Object.keys(errors).length) return json({ ok: false, errors }, { status: 400 });

  await prisma.service.update({
    where: { id },
    data: { name, category, basePrice, baseMinutes, active },
  });

  return redirect(`/services/${id}`);
}

export default function ServiceDetail() {
  const { svc } = useLoaderData<typeof loader>();
  const nav = useNavigation();
  const action = useActionData<typeof action>() as any;
  const saving = nav.state === "submitting";

  return (
    <Polaris.Page
      title={svc.name}
      backAction={{ url: "/services" }}
      primaryAction={{ content: "Save", onAction: () => document.getElementById("svc-form")?.dispatchEvent(new Event("submit", {cancelable: true, bubbles: true})) }}
      secondaryActions={[
        {
          content: "Delete",
          destructive: true,
          onAction: () => {
            const f = document.getElementById("svc-delete") as HTMLFormElement;
            f?.submit();
          },
        },
      ]}
    >
      <Polaris.Layout>
        <Polaris.Layout.Section>
          <Polaris.Card>
            <Form id="svc-form" method="post">
              <Polaris.BlockStack gap="400" padding="400">
                <Polaris.TextField label="Name" name="name" defaultValue={svc.name} error={action?.errors?.name} />
                <Polaris.TextField label="Category" name="category" defaultValue={svc.category ?? ""} />
                <Polaris.TextField label="Base price" type="number" name="basePrice" defaultValue={String(svc.basePrice ?? 0)} error={action?.errors?.basePrice} />
                <Polaris.TextField label="Default minutes" type="number" name="baseMinutes" defaultValue={String(svc.baseMinutes ?? 60)} error={action?.errors?.baseMinutes} />
                <Polaris.Checkbox label="Active" name="active" defaultChecked={svc.active} />
                <div>
                  <Polaris.Button primary submit loading={saving}>Save</Polaris.Button>
                </div>
              </Polaris.BlockStack>
            </Form>
          </Polaris.Card>
        </Polaris.Layout.Section>
      </Polaris.Layout>

      <Form id="svc-delete" method="post">
        <input type="hidden" name="_intent" value="delete" />
      </Form>
    </Polaris.Page>
  );
}

export function ErrorBoundary() {
  const err = useRouteError() as any;
  const message = (typeof err === "string" && err) || err?.message || "Something went wrong.";
  return (
    <Polaris.Page title="Service">
      <Polaris.Card sectioned>
        <Polaris.Text as="h2" variant="headingMd">Route error</Polaris.Text>
        <pre style={{whiteSpace:"pre-wrap"}}>{message}</pre>
      </Polaris.Card>
    </Polaris.Page>
  );
}
