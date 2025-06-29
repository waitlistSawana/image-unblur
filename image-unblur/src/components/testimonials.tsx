import { SectionHeader } from "./ui/section-header";
import { SectionWrapper } from "./ui/section-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "这个AI图像生成工具彻底改变了我的设计流程。我现在可以在几分钟内创建概念图，而不是几小时。",
    author: {
      name: "李明",
      title: "UI/UX 设计师",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    rating: 5,
  },
  {
    content:
      "作为一名内容创作者，我每天都需要大量的视觉素材。这个工具不仅节省了我的时间，还为我的内容增添了独特的视觉效果。",
    author: {
      name: "王芳",
      title: "内容创作者",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    rating: 5,
  },
  {
    content:
      "我们公司使用这个工具为我们的营销活动创建图像，效果非常好。客户反馈也很积极，我们的转化率提高了30%。",
    author: {
      name: "张伟",
      title: "市场营销总监",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <SectionWrapper id="testimonials">
      <SectionHeader
        eyebrow="客户评价"
        title="用户怎么说"
        subtitle="来自各行各业的专业人士对我们的评价"
      />

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-card flex flex-col rounded-lg border p-6 shadow-sm"
          >
            {/* 评分 */}
            <div className="mb-4 flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                />
              ))}
            </div>

            {/* 评价内容 */}
            <p className="flex-1 text-lg font-medium italic">
              &quot;{testimonial.content}&quot;
            </p>

            {/* 用户信息 */}
            <div className="mt-6 flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                />
                <AvatarFallback>
                  {testimonial.author.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{testimonial.author.name}</p>
                <p className="text-muted-foreground text-sm">
                  {testimonial.author.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
