import { icons, LucideProps } from "lucide-react";

interface IconProps extends Partial<LucideProps> {
  name: keyof typeof icons;
}

const Icon: React.FC<IconProps> = ({ name, color = "currentColor", size = 24, ...rest }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.error(`Icon "${name}" not found in Lucide icons.`);
    return null;
  }

  return <LucideIcon color={color} size={size} {...rest} />;
};

export default Icon;