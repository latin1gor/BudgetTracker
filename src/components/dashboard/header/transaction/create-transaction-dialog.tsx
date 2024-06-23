"use client";

import { ReactNode, useCallback } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  CreateTransactionSchema,
  CreateTransactionType,
} from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "@/components/dashboard/header/category/category-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface IProps {
  trigger: ReactNode;
  type: TransactionType;
}

const CreateTransactionDialog = ({ trigger, type }: IProps) => {
  const form = useForm<CreateTransactionType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const onChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Create a new{" "}
          <span
            className={cn(
              type === "income" ? "text-emerald-500" : "text-red-500",
            )}
          >
            {type}
          </span>{" "}
          transaction
        </DialogTitle>
        <Form {...form}>
          <form className={"space-y-4"}>
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction Description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} type={"number"} {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction Amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className={"flex justify-between"}>
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type} onChange={onChange} />
                    </FormControl>
                    <FormDescription>
                      Transaction Description (optional)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground ",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon
                              className={"ml-auto h-4 w-4 opacity-50"}
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className={"w-auto p-0"}>
                        <Calendar
                          mode={"single"}
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select the date</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        {/*<DialogFooter>*/}
        {/*  <DialogClose asChild>*/}
        {/*    <Button*/}
        {/*      className={"w-full"}*/}
        {/*      type={"button"}*/}
        {/*      variant={"secondary"}*/}
        {/*      onClick={() => form.reset()}*/}
        {/*    >*/}
        {/*      Cancel*/}
        {/*    </Button>*/}
        {/*  </DialogClose>*/}
        {/*  <Button*/}
        {/*    className={"w-full"}*/}
        {/*    type={"button"}*/}
        {/*    variant={"secondary"}*/}
        {/*    onClick={form.handleSubmit(onSubmit)}*/}
        {/*    disabled={isPending}*/}
        {/*  >*/}
        {/*    {!isPending && "Create"}*/}
        {/*    {isPending && <Loader2 className={"animate-spin"} />}*/}
        {/*  </Button>*/}
        {/*</DialogFooter>*/}
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;
