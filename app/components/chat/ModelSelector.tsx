import { classNames } from '~/utils/classNames';

export type ModelProvider = 'anthropic' | 'google';

interface ModelSelectorProps {
  value: ModelProvider;
  onChange: (value: ModelProvider) => void;
  className?: string;
}

const MODELS = [
  { value: 'anthropic' as const, label: 'Claude Sonnet 4.5' },
  { value: 'google' as const, label: 'Gemini Flash Lite (Latest)' },
];

export function ModelSelector({ value, onChange, className }: ModelSelectorProps) {
  return (
    <div className={classNames('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ModelProvider)}
        className="bg-builder-elements-background-depth-2 text-builder-elements-textPrimary text-sm font-medium px-3 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-builder-elements-focus hover:bg-builder-elements-background-depth-3 transition-all cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        {MODELS.map((model) => (
          <option key={model.value} value={model.value} className="bg-builder-elements-background-depth-2">
            {model.label}
          </option>
        ))}
      </select>
    </div>
  );
}
