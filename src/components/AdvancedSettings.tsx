import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdvancedSettingsProps {
  includeNumbers: string;
  excludeNumbers: string;
  onIncludeChange: (val: string) => void;
  onExcludeChange: (val: string) => void;
}

const AdvancedSettings = ({
  includeNumbers,
  excludeNumbers,
  onIncludeChange,
  onExcludeChange,
}: AdvancedSettingsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="settings" className="border-border rounded-2xl overflow-hidden bg-card">
        <AccordionTrigger className="px-5 py-3 font-title text-base hover:no-underline">
          <span>⚙️ 고급 설정</span>
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-4 space-y-4">
          <div>
            <Label className="text-sm font-title mb-1 block">
              📌 포함할 번호 (쉼표 구분)
            </Label>
            <Input
              placeholder="예: 7, 14, 21"
              value={includeNumbers}
              onChange={(e) => onIncludeChange(e.target.value)}
              className="rounded-xl bg-background"
            />
          </div>
          <div>
            <Label className="text-sm font-title mb-1 block">
              🚫 제외할 번호 (쉼표 구분)
            </Label>
            <Input
              placeholder="예: 3, 8, 42"
              value={excludeNumbers}
              onChange={(e) => onExcludeChange(e.target.value)}
              className="rounded-xl bg-background"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedSettings;
