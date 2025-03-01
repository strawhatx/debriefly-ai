
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Save, Search, Tag, Calendar, Edit, FileText, ThumbsUp, AlertTriangle, Smile, Frown, Meh } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define emotion tags with their respective colors and icons
const emotionTags = [
  { id: "confident", label: "Confident", color: "bg-blue-100 text-blue-800", icon: <ThumbsUp className="w-4 h-4" /> },
  { id: "fearful", label: "Fearful", color: "bg-red-100 text-red-800", icon: <AlertTriangle className="w-4 h-4" /> },
  { id: "impatient", label: "Impatient", color: "bg-amber-100 text-amber-800", icon: <Meh className="w-4 h-4" /> },
  { id: "greedy", label: "Greedy", color: "bg-orange-100 text-orange-800", icon: <ThumbsUp className="w-4 h-4 rotate-180" /> },
  { id: "satisfied", label: "Satisfied", color: "bg-green-100 text-green-800", icon: <Smile className="w-4 h-4" /> },
  { id: "regretful", label: "Regretful", color: "bg-purple-100 text-purple-800", icon: <Frown className="w-4 h-4" /> },
];

export const BehaviorialPatterns = () => {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tradeNote, setTradeNote] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch trade data
  const { data: trades, isLoading, refetch } = useQuery({
    queryKey: ["behavioralTrades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("positions")
        .select(`
          id, 
          symbol, 
          entry_date, 
          closing_date, 
          pnl, 
          quantity, 
          position_type,
          fill_price,
          fees,
          trading_account_id,
          trading_accounts(account_name)
        `)
        .order("entry_date", { ascending: false });

      if (error) {
        console.error("Error fetching trades:", error);
        throw error;
      }

      return data;
    },
  });

  // Fetch insights for the selected trade
  const { data: insights, refetch: refetchInsights } = useQuery({
    queryKey: ["tradeInsights", selectedTrade?.id],
    queryFn: async () => {
      if (!selectedTrade) return null;

      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .eq("position_id", selectedTrade.id)
        .eq("type", "EMOTIONAL")
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is 'not found'
        console.error("Error fetching insights:", error);
        throw error;
      }

      return data;
    },
    enabled: !!selectedTrade,
  });

  // Update state when a trade is selected
  useEffect(() => {
    if (selectedTrade && insights) {
      setTradeNote(insights.content?.notes || "");
      setSelectedEmotions(insights.content?.emotions || []);
    } else if (selectedTrade) {
      setTradeNote("");
      setSelectedEmotions([]);
    }
  }, [selectedTrade, insights]);

  // Filter trades based on search query
  const filteredTrades = trades?.filter(
    (trade) => trade.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate ROI for a trade
  const calculateROI = (trade) => {
    if (!trade || !trade.pnl || !trade.fill_price || !trade.quantity) return "N/A";
    const investment = trade.fill_price * trade.quantity;
    const roi = (trade.pnl / investment) * 100;
    return roi.toFixed(2) + "%";
  };

  // Toggle emotion tag selection
  const toggleEmotion = (emotionId) => {
    setSelectedEmotions((prev) => {
      if (prev.includes(emotionId)) {
        return prev.filter((id) => id !== emotionId);
      } else {
        return [...prev, emotionId];
      }
    });
  };

  // Save trade notes and emotions
  const saveTradeInsights = async () => {
    if (!selectedTrade) return;

    setIsSaving(true);
    try {
      const insightData = {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        position_id: selectedTrade.id,
        type: "EMOTIONAL",
        content: {
          notes: tradeNote,
          emotions: selectedEmotions,
        },
      };

      if (insights) {
        // Update existing insight
        const { error } = await supabase
          .from("insights")
          .update(insightData)
          .eq("id", insights.id);

        if (error) throw error;
      } else {
        // Create new insight
        const { error } = await supabase
          .from("insights")
          .insert(insightData);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Trade notes saved successfully",
      });

      refetchInsights();
    } catch (error) {
      console.error("Error saving insights:", error);
      toast({
        title: "Error",
        description: "Failed to save trade notes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Suggest emotions based on trade outcome (simplified version)
  const suggestEmotions = () => {
    if (!selectedTrade) return;

    // Simple suggestion logic based on P&L
    const suggestions = [];
    if (selectedTrade.pnl > 0) {
      suggestions.push("confident", "satisfied");
    } else {
      suggestions.push("regretful");
      if (Math.abs(selectedTrade.pnl) > 100) {
        suggestions.push("fearful");
      }
    }

    setSelectedEmotions(suggestions);
    toast({
      title: "AI Suggestion",
      description: "Emotions have been suggested based on trade outcome",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trade Notebook</h1>
        <p className="text-muted-foreground">
          Track your trades, emotions, and behavioral patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade List Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Trade History</span>
              <div className="relative flex-1 max-w-sm ml-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        Loading trades...
                      </TableCell>
                    </TableRow>
                  ) : filteredTrades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        No trades found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrades.map((trade) => (
                      <TableRow
                        key={trade.id}
                        className={`cursor-pointer hover:bg-muted ${
                          selectedTrade?.id === trade.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedTrade(trade)}
                      >
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                            {format(new Date(trade.entry_date), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              trade.pnl > 0
                                ? "text-green-600"
                                : trade.pnl < 0
                                ? "text-red-600"
                                : ""
                            }
                          >
                            ${trade.pnl ? trade.pnl.toFixed(2) : "0.00"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Trade Details Panel */}
        <Card className="lg:col-span-2">
          {selectedTrade ? (
            <>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="mr-2">{selectedTrade.symbol}</span>
                    <Badge variant="outline" className="mr-2">
                      {selectedTrade.position_type}
                    </Badge>
                    <Badge
                      className={
                        selectedTrade.pnl > 0
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }
                    >
                      {selectedTrade.pnl > 0 ? "Profit" : "Loss"}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={suggestEmotions}>
                    <Tag className="mr-1 h-4 w-4" />
                    Suggest Emotions
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Entry Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedTrade.entry_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Exit Date</p>
                    <p className="font-medium">
                      {selectedTrade.closing_date
                        ? format(new Date(selectedTrade.closing_date), "MMM d, yyyy")
                        : "Still Open"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">P&L</p>
                    <p
                      className={`font-medium ${
                        selectedTrade.pnl > 0
                          ? "text-green-600"
                          : selectedTrade.pnl < 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      ${selectedTrade.pnl ? selectedTrade.pnl.toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p
                      className={`font-medium ${
                        selectedTrade.pnl > 0
                          ? "text-green-600"
                          : selectedTrade.pnl < 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {calculateROI(selectedTrade)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="font-medium">{selectedTrade.quantity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Entry Price</p>
                    <p className="font-medium">
                      ${selectedTrade.fill_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Fees</p>
                    <p className="font-medium">
                      ${selectedTrade.fees.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Account</p>
                    <p className="font-medium">
                      {selectedTrade.trading_accounts?.account_name || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-semibold flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Trade Notes
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveTradeInsights}
                        disabled={isSaving}
                      >
                        <Save className="mr-1 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Add your post-trade reflections here..."
                      className="min-h-[120px]"
                      value={tradeNote}
                      onChange={(e) => setTradeNote(e.target.value)}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                      <Tag className="mr-2 h-5 w-5" />
                      Emotional Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {emotionTags.map((emotion) => (
                        <Badge
                          key={emotion.id}
                          variant="outline"
                          className={`cursor-pointer flex items-center gap-1 px-3 py-1 ${
                            selectedEmotions.includes(emotion.id)
                              ? emotion.color
                              : "hover:bg-muted"
                          }`}
                          onClick={() => toggleEmotion(emotion.id)}
                        >
                          {emotion.icon}
                          {emotion.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
              <Edit className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Trade Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a trade from the list to view details, add notes, and track your
                emotional responses. This helps identify behavioral patterns in your trading.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
