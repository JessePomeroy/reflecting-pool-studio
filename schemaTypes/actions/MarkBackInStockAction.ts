import type { DocumentActionComponent } from "sanity";
import { useDocumentOperation } from "sanity";

export const MarkBackInStockAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const isInStock = props.draft?.inStock !== false && props.published?.inStock !== false;

  return {
    label: "Mark back in stock",
    disabled: isInStock,
    tone: "positive",
    onHandle: () => {
      patch.execute([{ set: { inStock: true } }]);
      publish.execute();
      props.onComplete();
    },
  };
};
