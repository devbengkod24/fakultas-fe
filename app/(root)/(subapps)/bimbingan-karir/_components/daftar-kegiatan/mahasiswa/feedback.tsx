"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { feedbackSchema, type FeedbackFormData } from "./schema";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kegiatanId: number;
  kegiatanNama: string;
  onSubmit: (data: FeedbackFormData) => Promise<void>;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  onOpenChange,
  kegiatanId,
  kegiatanNama,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      komentar: "",
      rating: 0,
      kegiatan_id: kegiatanId,
    },
  });

  // Update kegiatan_id ketika kegiatanId berubah
  useEffect(() => {
    if (kegiatanId) {
      form.setValue("kegiatan_id", kegiatanId);
    }
  }, [kegiatanId, form]);

  // Reset form ketika dialog dibuka
  useEffect(() => {
    if (open) {
      form.reset({
        komentar: "",
        rating: 0,
        kegiatan_id: kegiatanId,
      });
    }
  }, [open, kegiatanId, form]);

  const handleSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (rating: number) => void;
  }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hover || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-start">Feedback Kegiatan</DialogTitle>
          <DialogDescription className="text-start">{kegiatanNama}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel> <span className="text-destructive">*</span>
                  <FormControl>
                    <StarRating value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="komentar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Komentar</FormLabel> <span className="text-destructive">*</span>
                  <FormControl>
                    <Textarea
                      placeholder="Berikan komentar Anda tentang kegiatan ini..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;