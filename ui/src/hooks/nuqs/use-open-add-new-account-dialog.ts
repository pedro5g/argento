import { useQueryState, parseAsBoolean } from "nuqs";

export function useOpenAddNewAccountDialog() {
  const [open, setOpen] = useQueryState(
    "open-new-account-dialog",
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
