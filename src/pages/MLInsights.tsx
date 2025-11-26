import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, TrendingDown, Minus, AlertCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { mockMLPredictions } from '@/lib/mockData';
import { toast } from 'sonner';

export default function MLInsights() {
  const predictions = mockMLPredictions;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleTrainModel = () => {
    toast.info('ML model training will be triggered via C# ML.NET backend');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            ML Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered demand forecasting and stock optimization using ML.NET
          </p>
        </div>
        <Button onClick={handleTrainModel} className="shadow-primary">
          <Zap className="mr-2 h-4 w-4" />
          Train Model
        </Button>
      </div>

      {/* ML Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-medium gradient-primary text-white">
          <CardHeader>
            <CardTitle className="text-white">Model Accuracy</CardTitle>
            <CardDescription className="text-white/80">Current prediction accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89.5%</div>
            <p className="text-sm text-white/80 mt-2">Based on 1,247 predictions</p>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Products Analyzed</CardTitle>
            <CardDescription>ML predictions available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{predictions.length}</div>
            <p className="text-sm text-muted-foreground mt-2">Updated daily</p>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Optimization Score</CardTitle>
            <CardDescription>Inventory efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">94.2%</div>
            <p className="text-sm text-muted-foreground mt-2">+3.5% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Demand Predictions */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Demand Forecasting</CardTitle>
          <CardDescription>
            AI-powered predictions for next 30 days using ML.NET regression models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {predictions.map((pred) => (
            <div key={pred.productId} className="space-y-3 border-b pb-6 last:border-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{pred.productName}</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getTrendIcon(pred.trend)}
                      {pred.trend}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {(pred.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <Badge variant={pred.recommendedReorder > 0 ? 'default' : 'secondary'}>
                  {pred.recommendedReorder > 0 ? 'Action Required' : 'Optimal'}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Current Stock</p>
                  <p className="text-2xl font-bold">{pred.currentStock}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Predicted Demand</p>
                  <p className="text-2xl font-bold text-primary">{pred.predictedDemand}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recommended Order</p>
                  <p className="text-2xl font-bold text-success">{pred.recommendedReorder}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Coverage</span>
                  <span className="font-medium">
                    {pred.currentStock > 0 
                      ? Math.round((pred.currentStock / pred.predictedDemand) * 100) + '%'
                      : '0%'}
                  </span>
                </div>
                <Progress 
                  value={pred.currentStock > 0 
                    ? Math.min((pred.currentStock / pred.predictedDemand) * 100, 100)
                    : 0} 
                  className="h-2"
                />
              </div>

              {pred.recommendedReorder > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Reorder Recommendation</p>
                    <p className="text-muted-foreground">
                      Order {pred.recommendedReorder} units to meet predicted demand for the next 30 days
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ML Model Information */}
      <Card className="shadow-medium border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Machine Learning Implementation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Technology Stack</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• ML.NET Framework</li>
                <li>• Time Series Forecasting</li>
                <li>• Regression Models</li>
                <li>• Real-time Predictions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Historical data analysis</li>
                <li>• Seasonal trend detection</li>
                <li>• Demand pattern recognition</li>
                <li>• Automatic reorder suggestions</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="font-medium mb-2">Backend Integration Ready</p>
            <p className="text-muted-foreground">
              This UI is designed to connect with C# ML.NET backend for real-time predictions,
              model training, and advanced analytics. The backend will handle data processing,
              model training, and serve predictions via REST API.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
