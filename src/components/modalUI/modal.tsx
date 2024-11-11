"use client";

import { Modal, ModalContent, ModalBody } from "@nextui-org/modal";
import { useMediaQuery } from "usehooks-ts";

type Size =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

export default function Modals({
  isOpen,
  onOpenChange,
  children,
  onClose,
  size,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  onOpenChange: () => void;
  onClose?: () => void;
  size?: Size;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      placement={isDesktop ? "center" : "bottom"}
      className="bg-secondary "
      size={size ? size : "lg"}
    >
      <ModalContent>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
