import { SectionHeader } from "./ui/section-header";
import { SectionWrapper } from "./ui/section-wrapper";
import { Zap, Shield, Sparkles, Rocket, Palette, Code } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "快速生成",
    description: "利用先进的AI技术，在几秒钟内创建高质量图像",
  },
  {
    icon: Shield,
    title: "安全可靠",
    description: "所有生成的内容都经过严格审核，确保符合内容政策",
  },
  {
    icon: Sparkles,
    title: "创意无限",
    description: "提供多种风格和主题选择，释放您的创意潜能",
  },
  {
    icon: Rocket,
    title: "高效工作流",
    description: "简化的用户界面，让您的创作过程更加流畅",
  },
  {
    icon: Palette,
    title: "风格多样",
    description: "支持多种艺术风格，从写实到抽象应有尽有",
  },
  {
    icon: Code,
    title: "API支持",
    description: "完整的API接口，轻松集成到您的应用程序中",
  },
];

export function Features() {
  return (
    <SectionWrapper id="features">
      <SectionHeader
        eyebrow="Features"
        title="为什么选择我们"
        subtitle="《内容，特色，好处》"
      />

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card flex flex-col rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <feature.icon className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
