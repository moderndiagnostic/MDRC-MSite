"use client";

type Props = {
  pageData: {
    page_title: string;
    page_description: string;
  };
};

const PageClient = ({ pageData }: Props) => {
  return (
    <div className="p-4">
      <div>
        <h1 className="mb-3 text-2xl">{pageData?.page_title}</h1>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: pageData?.page_description || "",
        }}
      />
    </div>
  );
};

export default PageClient;
