"use client";

import { SectionHeader } from "./ui/section-header";
import { SectionWrapper } from "./ui/section-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "AI图像生成器是如何工作的？",
    answer:
      "我们的AI图像生成器使用先进的深度学习模型，通过分析您提供的文本描述来创建图像。系统经过数百万张图像的训练，能够理解文本与视觉元素之间的关系，从而生成符合您描述的高质量图像。",
  },
  {
    question: "我可以使用生成的图像做什么？",
    answer:
      "您可以将生成的图像用于个人和商业项目，包括社交媒体内容、网站设计、市场营销材料、概念艺术等。请注意，虽然您拥有生成图像的使用权，但AI模型本身及其训练数据的版权归属可能会影响某些特定用途。",
  },
  {
    question: "生成图像需要多长时间？",
    answer:
      "大多数图像生成只需要几秒钟。生成时间可能会因图像复杂度、服务器负载和您选择的质量设置而有所不同。高分辨率或更详细的图像可能需要更长的处理时间。",
  },
  {
    question: "我可以编辑已生成的图像吗？",
    answer:
      "是的，我们提供基本的编辑功能，允许您调整生成的图像。您还可以下载图像并在您喜欢的图像编辑软件中进一步编辑。我们还提供重新生成和微调选项，以便您可以迭代改进结果。",
  },
  {
    question: "有免费计划吗？",
    answer:
      "是的，我们提供免费计划，允许您每月生成有限数量的图像。对于需要更多功能和更高使用限制的用户，我们还提供各种付费订阅计划。",
  },
  {
    question: "如何获得最佳结果？",
    answer:
      "为获得最佳结果，请提供详细的描述，包括场景、风格、颜色、情绪等元素。使用具体的形容词和清晰的指示。您还可以参考我们的提示词指南，了解如何编写有效的提示以获得理想的输出。",
  },
];

export function FAQs() {
  return (
    <SectionWrapper id="faqs" className="bg-muted/50">
      <SectionHeader
        eyebrow="常见问题"
        title="您可能想知道的问题"
        subtitle="我们整理了用户最常问的一些问题，希望能帮助您更好地了解我们的服务"
      />

      <div className="mx-auto mt-16 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionWrapper>
  );
}
