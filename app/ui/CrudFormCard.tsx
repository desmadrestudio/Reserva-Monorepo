import { Form } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";

export interface CrudFormCardProps {
  singular: string;
  plural: string;
  fieldName: string;
  fieldLabel?: string;
  items: { id: string; name: string }[];
  item?: { id?: string | null; [key: string]: any } | null;
  actionData?: { error?: string; success?: boolean } | null;
  submitting?: boolean;
}

export default function CrudFormCard({
  singular,
  plural,
  fieldName,
  fieldLabel = "Name",
  items,
  item,
  actionData,
  submitting,
}: CrudFormCardProps) {
  const { Card, TextField, Button, Banner, Text } = Polaris;
  return (
    <>
      <Card sectioned title={item ? `Edit ${singular}` : `Add ${singular}`}>
        <Form method="post">
          {actionData?.error && <Banner status="critical">{actionData.error}</Banner>}
          {actionData?.success && <Banner status="success">Saved.</Banner>}
          <input type="hidden" name="id" value={item?.id ?? ""} />
          <TextField
            label={fieldLabel}
            name={fieldName}
            defaultValue={(item && item[fieldName]) ?? ""}
            required
          />
          <Button submit primary loading={submitting}>
            Save
          </Button>
        </Form>
      </Card>
      <Card sectioned title={plural}>
        {items.map((it) => (
          <Text key={it.id} as="span">
            {it.name}{" "}
            <Button url={`?id=${it.id}`} size="slim">
              Edit
            </Button>
          </Text>
        ))}
      </Card>
    </>
  );
}
