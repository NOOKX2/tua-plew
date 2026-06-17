import Image from "next/image";
import type { Campaign } from "@/lib/types";
import CampaignGamingArt, { isGamingCodeCampaign } from "./CampaignGamingArt";

type Props = {
  campaign: Campaign;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  variant?: "card" | "hero";
};

export default function CampaignCoverImage({
  campaign,
  className = "",
  imageClassName = "",
  sizes,
  priority = false,
  variant = "card",
}: Props) {
  if (isGamingCodeCampaign(campaign.id)) {
    return <CampaignGamingArt className={className} variant={variant} />;
  }

  return (
    <Image
      src={campaign.image}
      alt={campaign.title}
      fill
      priority={priority}
      sizes={sizes}
      className={imageClassName}
    />
  );
}
