import {
    Page,
    Layout,
    Card,
    Text,
    Button,
    Stack,
  } from "@shopify/polaris";
  import { Form, useSearchParams, json, redirect } from "@remix-run/react";
  import type { ActionFunction } from "@remix-run/node";
  
  export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const booking = Object.fromEntries(formData);
  

  
    // 🧪 You could save to DB here instead
    // await prisma.booking.create({ data: booking });
  
    return redirect("/thank-you");
  };
  
  export default function ReviewBooking() {
    const [searchParams] = useSearchParams();
  
    const location = searchParams.get("location");
    const category = searchParams.get("category");
    const service = searchParams.get("service");
    const duration = searchParams.get("duration");
    const staff = searchParams.get("staff");
    const gender = searchParams.get("gender");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const addons = searchParams.getAll("addons");
  
    const formattedDate = date
      ? new Date(date).toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      : "Not selected";
  
    return (
      <Page title="Review Booking">
        <Layout>
          <Layout.Section>
            <Card sectioned title="You're Booking:">
              <Stack vertical spacing="tight">
                <Text>
                  <strong>Service:</strong> {service ?? "Not selected"}
                </Text>
                <Text>
                  <strong>Duration:</strong> {duration ?? "Not selected"} mins
                </Text>
                <Text>
                  <strong>Date:</strong> {formattedDate}
                </Text>
                <Text>
                  <strong>Time:</strong> {time ?? "Not selected"}
                </Text>
                {staff && (
                  <Text>
                    <strong>Staff:</strong> {staff}
                  </Text>
                )}
                {gender && gender !== "none" && (
                  <Text>
                    <strong>Gender Pref:</strong> {gender}
                  </Text>
                )}
                {addons.length > 0 && (
                  <Text>
                    <strong>Add-ons:</strong> {addons.join(", ")}
                  </Text>
                )}
              </Stack>
            </Card>
          </Layout.Section>
  
          <Layout.Section>
            <Card sectioned>
              <Form method="post">
                <input type="hidden" name="location" value={location ?? ""} />
                <input type="hidden" name="category" value={category ?? ""} />
                <input type="hidden" name="service" value={service ?? ""} />
                <input type="hidden" name="duration" value={duration ?? ""} />
                <input type="hidden" name="date" value={date ?? ""} />
                <input type="hidden" name="time" value={time ?? ""} />
                {staff && <input type="hidden" name="staff" value={staff} />}
                {gender && <input type="hidden" name="gender" value={gender} />}
                {addons.map((addon) => (
                  <input key={addon} type="hidden" name="addons" value={addon} />
                ))}
  
                <Button primary fullWidth submit>
                  Confirm Booking
                </Button>
              </Form>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }