interface Props {
  schema: Record<string, unknown>;
}

export default function SchemaOrg({ schema }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
