import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, TrendingDown, Minus, AlertCircle, Zap, Target, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { mockMLPredictions, demandForecastData, mlAccuracyHistory } from '@/lib/mockData';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from 'recharts';

const radarData = [
  { subject: 'Accuracy', A: 89.5, fullMark: 100 },
  { subject: 'Recall', A: 85, fullMark: 100 },
  { subject: 'Precision', A: 91, fullMark: 100 },
  { subject: 'F1 Score', A: 88, fullMark: 100 },
  { subject: 'Coverage', A: 94, fullMark: 100 },
  { subject: 'Speed', A: 96, fullMark: 100 },
];

export default function MLInsights() {
  const predictions = mockMLPredictions;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleTrainModel = () => {
    toast.info('ML model training triggered via C# ML.NET backend...');
    setTimeout(() => toast.success('Model training complete! Accuracy: 90.2%'), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            ML Insights
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered demand forecasting and stock optimization using ML.NET</p>
        </div>
        <Button onClick={handleTrainModel}>
          <Zap className="mr-2 h-4 w-4" /> Retrain Model
        </Button>
      </div>

      {/* ML Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-sm bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold">89.5%</div>
                <p className="text-sm text-muted-foreground">Model Accuracy</p>
                <p className="text-xs text-success mt-0.5">+3.5% from v2.5</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-sm">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-accent" />
              </div>
              <div>
                <div className="text-3xl font-bold">{predictions.length}</div>
                <p className="text-sm text-muted-foreground">Products Analyzed</p>
                <p className="text-xs text-muted-foreground mt-0.5">Updated daily</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-sm">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-success" />
              </div>
              <div>
                <div className="text-3xl font-bold text-success">94.2%</div>
                <p className="text-sm text-muted-foreground">Optimization Score</p>
                <p className="text-xs text-success mt-0.5">+3.5% this month</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Demand Forecast Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Demand Forecast</CardTitle>
              <CardDescription>Actual vs predicted demand over 6 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={demandForecastData}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                  <XAxis dataKey="day" stroke="hsl(215, 15%, 45%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 15%, 45%)" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(215, 20%, 88%)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="predicted" stroke="hsl(217, 91%, 60%)" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
                  <Line type="monotone" dataKey="actual" stroke="hsl(142, 76%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="Actual" connectNulls={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Performance Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Model Performance Metrics</CardTitle>
              <CardDescription>ML.NET model evaluation scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(215, 20%, 88%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 45%)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Model v3.0" dataKey="A" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Accuracy History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Model Accuracy Over Time</CardTitle>
            <CardDescription>Training accuracy improvement across model versions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mlAccuracyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                <XAxis dataKey="version" stroke="hsl(215, 15%, 45%)" fontSize={12} />
                <YAxis domain={[60, 100]} stroke="hsl(215, 15%, 45%)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(215, 20%, 88%)' }} />
                <Bar dataKey="accuracy" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Predictions Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Demand Forecasting</CardTitle>
          <CardDescription>AI-powered predictions for next 30 days using ML.NET regression models</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {predictions.map((pred) => (
            <motion.div key={pred.productId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 border-b pb-5 last:border-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{pred.productName}</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getTrendIcon(pred.trend)}
                      {pred.trend}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Confidence: {(pred.confidence * 100).toFixed(1)}%</p>
                </div>
                <Badge variant={pred.recommendedReorder > 0 ? 'destructive' : 'default'}
                  className={pred.recommendedReorder > 0 ? '' : 'bg-success/10 text-success border-success/20'}>
                  {pred.recommendedReorder > 0 ? 'Action Required' : 'Optimal'}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Current Stock</p>
                  <p className="text-xl font-bold mt-1">{pred.currentStock}</p>
                </div>
                <div className="rounded-lg bg-primary/5 p-3">
                  <p className="text-xs text-muted-foreground">Predicted Demand</p>
                  <p className="text-xl font-bold text-primary mt-1">{pred.predictedDemand}</p>
                </div>
                <div className="rounded-lg bg-success/5 p-3">
                  <p className="text-xs text-muted-foreground">Recommended Order</p>
                  <p className="text-xl font-bold text-success mt-1">{pred.recommendedReorder}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Stock Coverage</span>
                  <span className="font-medium">
                    {pred.currentStock > 0 ? Math.round((pred.currentStock / pred.predictedDemand) * 100) + '%' : '0%'}
                  </span>
                </div>
                <Progress value={pred.currentStock > 0 ? Math.min((pred.currentStock / pred.predictedDemand) * 100, 100) : 0} className="h-2" />
              </div>

              {pred.recommendedReorder > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/5 border border-destructive/10 p-3 text-sm">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-destructive">Reorder Recommendation</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Order {pred.recommendedReorder} units to meet predicted demand for the next 30 days
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
