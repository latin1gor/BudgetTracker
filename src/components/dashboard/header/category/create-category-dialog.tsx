"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categories";
import { useCallback, useState } from "react";
import { CircleOff, Loader2, PlusSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { CreateCategory } from "@/app/(dashboard)/_actions/categories";
import { useTheme } from "next-themes";
interface IProps {
  type: TransactionType;
  successCallback: (category: Category) => void;
}

const CreateCategoryDialog = ({ type, successCallback }: IProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: " ",
        icon: " ",
        type,
      });
      toast.success(`Category ${data.name} created successfully`, {
        id: "create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error("Something went wrong", { id: "create-category" });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      console.log("working");

      toast.loading("Creating category...", { id: "create-category" });
      mutate(values);
    },
    [mutate],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={""}>
        <Button
          variant={"ghost"}
          className={
            "flex border-separate items-center justify-start rounded border-b px-3 py-3 text-muted-foreground w-full"
          }
        >
          <PlusSquareIcon className={"mr-2 h-4 w-4"} /> Create new
        </Button>{" "}
      </DialogTrigger>
      <DialogContent className={"w-full"}>
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500",
              )}
            >
              {type}
            </span>
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-8"}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Category"} {...field} />
                  </FormControl>
                  <FormDescription>
                    This category name will appear in application
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="icon"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={"h-[100px] w-full"}
                        >
                          {form.watch("icon") ? (
                            <div className={"flex flex-col items-center gap-2"}>
                              <span className={"text-5xl"} role={"img"}>
                                {field.value}
                              </span>
                              <p className={"text-xs text-muted-foreground"}>
                                Click to select
                              </p>
                            </div>
                          ) : (
                            <div className={"flex flex-col items-center gap-2"}>
                              <CircleOff height={48} width={48} />{" "}
                              <p className={"text-xs text-muted-foreground"}>
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className={"w-full"}>
                        <EmojiPicker
                          theme={theme.resolvedTheme}
                          data={data}
                          onEmojiSelect={(e: { native: string }) =>
                            field.onChange(e.native)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    Select icon for category (required)
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className={"w-full"}
              type={"button"}
              variant={"secondary"}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className={"w-full"}
            type={"button"}
            variant={"secondary"}
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {!isPending && "Create"}
            {isPending && <Loader2 className={"animate-spin"} />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
