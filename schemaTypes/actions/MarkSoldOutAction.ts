import type { DocumentActionComponent } from "sanity";
import { useDocumentOperation } from "sanity";

export const MarkSoldOutAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const isAlreadySoldOut = props.draft?.inStock === false || props.published?.inStock === false;

  return {
    label: "Mark sold out",
    disabled: isAlreadySoldOut,
    tone: "critical",
    onHandle: () => {
      patch.execute([{ set: { inStock: false } }]);
      publish.execute();
      props.onComplete();
    },
  };
};
