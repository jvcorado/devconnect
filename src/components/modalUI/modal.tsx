"use client";

import { Modal, ModalContent, ModalBody } from "@nextui-org/modal";
import { useMediaQuery } from "usehooks-ts";

export default function Modals({
  isOpen,
  onOpenChange,
  children,
  onClose,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  onOpenChange: () => void;
  onClose?: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      placement={isDesktop ? "center" : "bottom"}
      className="bg-secondary"
      size={"lg"}
    >
      <ModalContent>
        <>
          <ModalBody>{children}</ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
