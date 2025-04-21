import useBrokerStore from "@/store/broker";

export const FileImportDescription = () => {
  const broker = useBrokerStore((state) => state.selected);

  return (
    <>
      {broker && (
        <div className="p-4 mb-4 border rounded-md bg-gray-700/70">
          <h3 className="font-medium mb-1">Selected Broker</h3>
          <p className="text-sm text-muted-foreground">
            {broker.name}
            {broker.description && (
              <span className="block mt-1 text-sm">
                {broker.description}
              </span>
            )}
          </p>
          {broker.asset_types?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Supported assets: {broker.asset_types.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4">How to Import Trades</h3>
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Follow these steps to import your trades:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Select your broker from the dropdown menu</li>
          <li>Choose the trading account where you want to import the trades</li>
          <li>Upload your trade history file (CSV or Excel format)</li>
          <li>Click "Start Import" to begin the process</li>
        </ol>
        <p>
          Your trades will be processed in the background. You can check the
          import status in the settings page under "Import History".
        </p>
        <p>
          Once your trades are processed, they will be marked as drafts,
          allowing you to review and make changes before analysis. You
          will be automatically redirected to that page once the sync is
          complete.
        </p>
      </div>
    </>
  );
};
