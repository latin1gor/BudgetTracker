"use client";

import { ReactNode } from "react";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCategory } from "@/app/(dashboard)/_actions/categories";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {mutate} from "swr";
import {TransactionType} from "@/lib/types";

interface IProps {
  trigger: ReactNode;
  category: Category;
}
const DeleteCategoryDialog = ({ category, trigger }: IProps) => {
  const categoryIdentifier = `${category.name}-${category.type}`;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success("Category deleted successfully", {
        id: categoryIdentifier,
      });
      await queryClient.invalidateQueries({
        ["categories"]
      });
    },
    onError: () => {
      toast.error("Something went wrong", {id: categoryIdentifier})
    }
  });
  return <AlertDialog>
    <AlertDialogTrigger asChild>

    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you absolutely sure ?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your category
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => {
          toast.loading("Deleting category...", {id: categoryIdentifier})
          deleteMutation.mutate({name: category.name, type: category.type as TransactionType})
        }}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
};

export default DeleteCategoryDialog;