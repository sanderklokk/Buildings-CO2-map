import { getData } from "../../../../Data/getdata.ts";

interface DataItemType {
    bygningnr:
      | string
      | number
      | undefined
    status:
      | string
      | number
      | undefined
    dato: string | number | Date;
    lat:
      | string
      | number
    long:
      | string
      | number
}

export const DataTextView = () => {
  const data = getData();

  return (
    <div className="p-4 overflow-auto max-h-full">
      {data.map(
        (item: DataItemType, index: number) => (
          <div key={index} className="border-b py-2">
            <p>
              <strong>Bygningsnummer:</strong> {item.bygningnr}
            </p>
            <p>
              <strong>Status:</strong> {item.status}
            </p>
            <p>
              <strong>Dato:</strong> {new Date(item.dato).toLocaleDateString()}
            </p>
            <p>
              <strong>Koordinater:</strong> {item.lat}, {item.long}
            </p>
          </div>
        )
      )}
    </div>
  );
};
