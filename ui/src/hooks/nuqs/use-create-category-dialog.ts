import { useQueryState, parseAsBoolean } from "nuqs";

export function useCreateCategoryDialog() {
  const [open, setOpen] = useQueryState(
    "open-create-category-dialog",
    parseAsBoolean.withDefault(false)
  );

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return {
    open,
    onOpen,
    onClose,
  };
}
