
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Gift } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Reward {
  id: string;
  title: string;
  points_required: number;
  is_active: boolean;
  redemption_count?: number;
}

interface RewardsManagementProps {
  rewards: Reward[];
  onCreateReward: (rewardData: { title: string; points_required: number }) => Promise<void>;
  onUpdateReward: (id: string, updates: Partial<{ title: string; points_required: number; is_active: boolean }>) => Promise<void>;
  onDeleteReward: (id: string) => Promise<void>;
  onToggleReward: (id: string, isActive: boolean) => Promise<void>;
}

const RewardsManagement = ({ 
  rewards, 
  onCreateReward, 
  onUpdateReward, 
  onDeleteReward, 
  onToggleReward 
}: RewardsManagementProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPoints, setNewPoints] = useState('');

  const handleSubmit = async () => {
    if (!newTitle.trim() || !newPoints.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const points = parseInt(newPoints);
    if (isNaN(points) || points < 1) {
      toast({
        title: "Error",
        description: "Points must be a positive number",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingReward) {
        await onUpdateReward(editingReward.id, { title: newTitle, points_required: points });
        setEditingReward(null);
      } else {
        await onCreateReward({ title: newTitle, points_required: points });
        setShowCreateForm(false);
      }

      setNewTitle('');
      setNewPoints('');
    } catch (error) {
      console.error('Error submitting reward:', error);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewPoints('');
    setShowCreateForm(false);
    setEditingReward(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Rewards Management</span>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Reward
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Create/Edit Form */}
      {(showCreateForm || editingReward) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingReward ? 'Edit Reward' : 'Create New Reward'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Reward Title</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Free Coffee, 10% Discount"
              />
            </div>
            <div>
              <Label htmlFor="points">Points Required</Label>
              <Input
                id="points"
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
                placeholder="e.g., 5, 10"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmit}>
                {editingReward ? 'Update Reward' : 'Create Reward'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Rewards ({rewards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{reward.title}</h3>
                    <p className="text-sm text-gray-600">{reward.points_required} points required</p>
                  </div>
                  <Badge variant={reward.is_active ? "default" : "secondary"}>
                    {reward.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {reward.redemption_count !== undefined && (
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{reward.redemption_count} redemptions</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingReward(reward);
                      setNewTitle(reward.title);
                      setNewPoints(reward.points_required.toString());
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleReward(reward.id, !reward.is_active)}
                  >
                    {reward.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteReward(reward.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {rewards.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No rewards created yet. Create your first reward to get started!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsManagement;
