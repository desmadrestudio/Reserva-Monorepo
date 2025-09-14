// app/routes/services.new.tsx
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useNavigation, Form } from "@remix-run/react";
import { useState } from "react";
import { Page, Layout, Card, TextField, Checkbox, Button, InlineStack, BlockStack } from "@shopify/polaris";
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

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (basePriceDollars < 0) errors.basePrice = "Price must be ≥ 0.";
  if (baseMinutes <= 0) errors.baseMinutes = "Duration must be > 0.";

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

  return (
    <Page title="Create Service">
      <Layout>
        <Layout.Section>
          <Card>
            <Form method="post">
              <BlockStack gap="400">
                <TextField label="Name" name="name" error={actionData?.errors?.name} autoFocus autoComplete="off" />
                <TextField label="Category" name="category" helpText="(optional)" autoComplete="off" />
                <TextField label="Base Price (USD)" name="basePrice" type="number" error={actionData?.errors?.basePrice} autoComplete="off" />
                <TextField label="Default Duration (minutes)" name="baseMinutes" type="number" error={actionData?.errors?.baseMinutes} autoComplete="off" />
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
