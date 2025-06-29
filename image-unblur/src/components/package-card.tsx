import { Check } from "lucide-react";
import { Card } from "~/components/ui/card";
import PackageButton from "./package-button";

export default async function PackageCard({
  packageId,
  title,
  description,
  price,
  priceId,
  currency,
  features,
}: {
  packageId: string;
  title: string;
  description: string;
  price: number;
  priceId: string;
  currency: string;
  features: {
    label: string;
    isGood: boolean;
  }[];
}) {
  return (
    <Card className="mx-auto w-full overflow-hidden rounded-xl border shadow-sm md:w-full">
      {/* 卡片内容 - 水平布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* 左侧内容区 */}
        <div className="flex-grow p-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground mt-2 text-sm">{description}</p>

          {/* 分隔线 */}
          <div className="bg-border my-4 h-px w-full"></div>

          {/* 功能列表 - 两列布局 */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="text-primary h-4 w-4" />
                <span className="text-sm">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧价格和按钮区 */}
        <div className="bg-muted/30 flex w-full flex-col items-center justify-center p-6 md:w-full md:rounded-l-2xl">
          <div className="mb-4 text-center">
            <div className="text-3xl font-bold">
              {price} {currency}
            </div>
            <p className="text-muted-foreground text-xs">one-time payment</p>
          </div>

          <PackageButton
            packageId={packageId}
            priceId={priceId}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}
