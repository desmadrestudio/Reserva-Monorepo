import * as Polaris from "@shopify/polaris";

export type AddOn = { id: string; label: string };

interface AddOnsCardProps {
  addons: AddOn[];
  selected: string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
}

export default function AddOnsCard({
  addons,
  selected,
  onToggle,
  onContinue,
}: AddOnsCardProps) {
  const { Card, Text, Stack, Checkbox, Button } = Polaris;
  return (
    <Card sectioned>
      <Text variant="headingMd" as="h2">
        Customize Your Booking
      </Text>
      <Stack vertical spacing="loose" style={{ marginTop: "1rem" }}>
        {addons.map((addon) => (
          <Checkbox
            key={addon.id}
            label={addon.label}
            checked={selected.includes(addon.id)}
            onChange={() => onToggle(addon.id)}
          />
        ))}
      </Stack>
      {selected.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <Text variant="bodySm" tone="subdued">
            Selected: {selected.length} add-on(s)
          </Text>
        </div>
      )}
      <div style={{ marginTop: "2rem" }}>
        <Button primary fullWidth onClick={onContinue}>
          Continue
        </Button>
      </div>
    </Card>
  );
}
