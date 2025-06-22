"use client";

import { cn } from "~/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dices, Loader2, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CreditButton from "./credit-button";

export const textToImageFormSchema = z.object({
  // 必填字段
  prompt: z.string().min(1),
  // 带默认值的字段
  aspect_ratio: z
    .enum([
      "match_input_image",
      "1:1",
      "16:9",
      "9:16",
      "4:3",
      "3:4",
      "3:2",
      "2:3",
      "4:5",
      "5:4",
      "21:9",
      "9:21",
      "2:1",
      "1:2",
    ])
    .default("match_input_image")
    .optional(),
  output_format: z.enum(["jpg", "png"]).default("png").optional(),
  // 可选字段
  input_image: z.string().url().nullable().optional(),
  seed: z.number().int().nullable().optional(),
});

interface TextToImageFormProps {
  className?: string;
  isLoading: boolean;
  handleSubmit?: (values: z.infer<typeof textToImageFormSchema>) => void;
}

export default function TextToImageForm({
  className,
  handleSubmit,
  isLoading,
  ...props
}: React.ComponentProps<"div"> & TextToImageFormProps) {
  const form = useForm<z.infer<typeof textToImageFormSchema>>({
    resolver: zodResolver(textToImageFormSchema),
    defaultValues: {
      prompt: "",
      aspect_ratio: "match_input_image",
      output_format: "png",
      input_image: null,
      seed: null,
    },
  });

  async function onSubmit(values: z.infer<typeof textToImageFormSchema>) {
    if (handleSubmit) {
      handleSubmit(values);
    }
  }

  return (
    <div className={cn("", className)} {...props}>
      <Form {...form}>
        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardHeader>
              <CardTitle>Text to Image</CardTitle>
              <CardDescription>
                Generate an image from a text prompt.
              </CardDescription>
              <CardAction>
                <CreditButton />
              </CardAction>
            </CardHeader>
            <CardContent className="w-full space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your prompt here..."
                        {...field}
                        className="min-h-24 w-full"
                        autoComplete="on"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="default"
                        className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                        onClick={() =>
                          field.onChange(
                            "A beautiful landscape with mountains, trees and a lake at sunset, 4k, highly detailed",
                          )
                        }
                      >
                        Landscape
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        className="cursor-pointer bg-purple-100 text-purple-800 hover:bg-purple-200"
                        onClick={() =>
                          field.onChange(
                            "A futuristic cityscape with flying cars, neon lights and skyscrapers, cyberpunk style, 4k",
                          )
                        }
                      >
                        Cyberpunk City
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        className="cursor-pointer bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        onClick={() =>
                          field.onChange(
                            "A fantasy character portrait, detailed features, magical elements, high quality, 4k resolution",
                          )
                        }
                      >
                        Fantasy Portrait
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        className="cursor-pointer bg-zinc-200 text-zinc-800 hover:bg-zinc-200"
                        onClick={() => field.onChange("")}
                      >
                        <Trash />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="input_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Image</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image URL..."
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value || null);
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspect Ratio</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select aspect ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="match_input_image">
                            Match Input Image
                          </SelectItem>
                          <SelectItem value="1:1">1:1</SelectItem>
                          <SelectItem value="16:9">16:9</SelectItem>
                          <SelectItem value="9:16">9:16</SelectItem>
                          <SelectItem value="4:3">4:3</SelectItem>
                          <SelectItem value="3:4">3:4</SelectItem>
                          <SelectItem value="3:2">3:2</SelectItem>
                          <SelectItem value="2:3">2:3</SelectItem>
                          <SelectItem value="4:5">4:5</SelectItem>
                          <SelectItem value="5:4">5:4</SelectItem>
                          <SelectItem value="21:9">21:9</SelectItem>
                          <SelectItem value="9:21">9:21</SelectItem>
                          <SelectItem value="2:1">2:1</SelectItem>
                          <SelectItem value="1:2">1:2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="output_format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output Format</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select output format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seed</FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center gap-2">
                        <Input
                          type="number"
                          className="flex-1"
                          placeholder="Random seed"
                          {...field}
                          value={field.value === null ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseInt(e.target.value, 10),
                            )
                          }
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant={"outline"}
                          size={"icon"}
                          className="cursor-pointer bg-transparent"
                          onClick={() =>
                            field.onChange(
                              Math.floor(Math.random() * 1000000000),
                            )
                          }
                        >
                          <Dices />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full cursor-pointer transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Form>
    </div>
  );
}
