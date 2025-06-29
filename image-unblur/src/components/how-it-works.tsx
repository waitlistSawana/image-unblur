import { SectionHeader } from "./ui/section-header";
import { SectionWrapper } from "./ui/section-wrapper";

const steps = [
  {
    number: "01",
    title: "描述您的想法",
    description:
      "使用自然语言描述您想要生成的图像，可以详细说明场景、风格和元素",
  },
  {
    number: "02",
    title: "选择风格和参数",
    description: "从多种艺术风格中选择，并调整参数以获得最佳效果",
  },
  {
    number: "03",
    title: "生成并优化",
    description: "AI会快速生成图像，您可以进一步调整和优化结果",
  },
  {
    number: "04",
    title: "下载和使用",
    description: "满意后，下载高分辨率图像用于您的项目或分享给他人",
  },
];

export function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works" className="bg-muted/50">
      <SectionHeader
        eyebrow="使用流程"
        title="如何使用我们的服务"
        subtitle="简单四步，轻松创建令人惊艳的AI图像"
      />

      <div className="relative mx-auto mt-16 w-fit">
        {/* 连接线 */}
        <div className="bg-border absolute top-0 left-[calc(2.5rem)] hidden h-full w-0.5 md:block" />

        <div className="space-y-12 md:space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col md:flex-row md:gap-12"
            >
              {/* 步骤数字 */}
              <div className="bg-primary/10 text-primary flex h-20 w-20 flex-none items-center justify-center rounded-full text-xl font-bold md:sticky md:top-20">
                {step.number}
              </div>

              {/* 步骤内容 */}
              <div className="mt-6 md:mt-0">
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground mt-3">{step.description}</p>

                {/* 步骤示例卡片 */}
                <div className="bg-card mt-6 rounded-lg border p-6 shadow-sm">
                  <div className="bg-muted/50 text-muted-foreground flex h-32 items-center justify-center rounded-md">
                    {index === 0 && "输入提示词示例"}
                    {index === 1 && "风格选择界面"}
                    {index === 2 && "生成结果预览"}
                    {index === 3 && "下载选项"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
