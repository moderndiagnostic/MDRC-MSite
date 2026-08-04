import PaymentStatus from "@/components/paynow/PaymentStatus";

type Props = {
  params: Promise<{ uuid: string }>;
};

export default async function PaymentFailed(props: Props) {
  const params = await props.params;
  const uuid = params.uuid?.[0];

  return <PaymentStatus type="failed" trackingId={uuid} />;
}
