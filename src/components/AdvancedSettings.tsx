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
  onIncludeChange: (value: string) => void;
  onExcludeChange: (value: string) => void;
}

const AdvancedSettings = ({
  includeNumbers,
  excludeNumbers,
  onIncludeChange,
  onExcludeChange,
}: AdvancedSettingsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="settings"
        className="overflow-hidden rounded-2xl border-border bg-card"
      >
        <AccordionTrigger className="justify-center px-5 py-3 font-title text-base hover:no-underline">
          <span>⚙️ 고급 설정</span>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 px-5 pb-4">
          <div>
            <Label htmlFor="include-numbers" className="mb-1 block font-title text-sm">
              📌 포함할 번호 (공백 구분)
            </Label>
            <Input
              id="include-numbers"
              placeholder="예: 7 14 21"
              value={includeNumbers}
              onChange={(event) => onIncludeChange(event.target.value)}
              className="rounded-xl bg-background"
            />
          </div>
          <div>
            <Label htmlFor="exclude-numbers" className="mb-1 block font-title text-sm">
              🚫 제외할 번호 (공백 구분)
            </Label>
            <Input
              id="exclude-numbers"
              placeholder="예: 3 8 42"
              value={excludeNumbers}
              onChange={(event) => onExcludeChange(event.target.value)}
              className="rounded-xl bg-background"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedSettings;
