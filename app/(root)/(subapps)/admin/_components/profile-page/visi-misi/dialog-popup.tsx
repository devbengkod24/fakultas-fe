"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RichTextEditor from "@/components/rich-text-editor";
import { VisiMisi } from "@/types/admin/profile-page/visi-misi/visi-misi";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  visi: z.string().min(1, "Visi harus diisi"),
  misi: z.array(z.object({ value: z.string().min(1, "Item misi tidak boleh kosong") })).min(1, "Misi harus memiliki setidaknya satu item"),
  prodi_id: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: VisiMisi;
  onSubmit?: (data: VisiMisi) => void;
  trigger?: React.ReactNode;
}

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visi: initialData?.visi || "",
      misi: initialData?.misi?.map(m => ({ value: m })) || [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "misi",
  });

  // Reset form when dialog opens/closes or initialData changes
  React.useEffect(() => {
    if (initialData && mode === "edit") {
      form.reset({
        visi: initialData?.visi || "",
        misi: initialData?.misi?.map(m => ({ value: m })) || [{ value: "" }],
      });
    } else if (mode === "add") {
      form.reset({
        visi: "",
        misi: [{ value: "" }],
      });
    }
  }, [initialData, open, mode, form]);

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;

    try {
      const submitData: VisiMisi = {
        visi: data.visi,
        misi: data.misi.map(m => m.value),
        id: initialData?.id,
      };

      await onSubmit(submitData);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isEditMode = mode === "edit";
  const title = isEditMode
    ? "Edit Visi Misi Program Studi"
    : "Tambah Visi Misi Program Studi";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={isEditMode ? "outline" : "default"}
            className="h-full"
          >
            {isEditMode ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            <span className="ml-2">
              {isEditMode ? "Edit" : "Tambah Visi Misi Program Studi"}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Visi */}
            <FormField
              control={form.control}
              name="visi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Visi Program Studi</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Misi (Field Array) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-semibold">Misi Program Studi</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: "" })}
                  className="h-8 gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`misi.${index}.value`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input 
                              {...inputField} 
                              placeholder={`Item misi #${index + 1}`}
                              className="flex-grow"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              {form.formState.errors.misi?.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.misi.root.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Menyimpan..." : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopUp;
