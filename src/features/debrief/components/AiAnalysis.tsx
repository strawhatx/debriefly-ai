import {
    Brain,
    ThumbsUp,
    AlertTriangle,
} from 'lucide-react';

interface AnalysisProps {
    what_went_well: string[];
    areas_for_improvement: string[];
}

// Reusable list item component
const AnalysisListItem = ({
    icon: Icon,
    text,
    iconColor
}: {
    icon: React.ElementType;
    text: string;
    iconColor: string;
}) => (
    <li className="flex items-start text-sm gap-2">
        <Icon className={`w-6 h-6 ${iconColor} mt-1`} />
        <span>{text}</span>
    </li>
);

// Add a reusable empty state component
const EmptyState = ({ message }: { message: string }) => (
    <div className="text-gray-400 text-sm italic flex items-center justify-center p-4">
        {message}
    </div>
);

// Reusable section component
const AnalysisSection = ({
    title, icon: Icon, iconColor, items, itemIcon,
}: {
    title: string;
    icon: React.ElementType;
    iconColor: string;
    items: string[] | null | undefined;
    itemIcon: React.ElementType;
}) => {
    const [first, second] = items
    return (
        <div className="p-4 bg-gray-900/50 rounded-lg">
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${iconColor}`} />
                {title}
            </h3>
            {!items?.length ? (
                <EmptyState message={`No ${title.toLowerCase()} data available`} />
            ) : (
                <ul className="space-y-2">
                    <AnalysisListItem
                        key={`${title}-${0}`}
                        icon={itemIcon}
                        text={first}
                        iconColor={iconColor}
                    />
                    <AnalysisListItem
                        key={`${title}-${1}`}
                        icon={itemIcon}
                        text={second}
                        iconColor={iconColor}
                    />
                </ul>
            )}
        </div>
    )
};

export const AiAnalysis = ({
    what_went_well = [],
    areas_for_improvement = []
}: Partial<AnalysisProps>) => {

    // Early return if both sections are empty
    if (!what_went_well?.length && !areas_for_improvement?.length) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Brain className="text-purple-400" />
                    AI Analysis
                </h2>
                <EmptyState message="No analysis data available" />
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="text-purple-400" />
                AI Analysis
            </h2>
            <div className="space-y-4">
                <AnalysisSection
                    title="What Went Well"
                    icon={ThumbsUp}
                    iconColor="text-emerald-400"
                    items={what_went_well}
                    itemIcon={ThumbsUp}
                />
                <AnalysisSection
                    title="Areas for Improvement"
                    icon={AlertTriangle}
                    iconColor="text-amber-400"
                    items={areas_for_improvement}
                    itemIcon={AlertTriangle}
                />
            </div>
        </div>
    );
}