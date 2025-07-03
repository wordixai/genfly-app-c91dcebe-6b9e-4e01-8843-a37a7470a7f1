import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Cloud, MoreHorizontal, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type EventType = 'work' | 'study' | 'exercise' | 'entertainment';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: EventType;
}

const eventColors = {
  work: 'bg-blue-100 text-blue-800 border-blue-200',
  study: 'bg-purple-100 text-purple-800 border-purple-200',
  exercise: 'bg-green-100 text-green-800 border-green-200',
  entertainment: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const eventTypeLabels = {
  work: '工作',
  study: '学习',
  exercise: '运动',
  entertainment: '娱乐'
};

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: '客户会议',
      description: '记得准备会议材料',
      date: new Date(2025, 0, 15),
      startTime: '10:00',
      endTime: '11:00',
      type: 'work'
    },
    {
      id: '2',
      title: '健身训练',
      description: '腿部训练日',
      date: new Date(2025, 0, 16),
      startTime: '18:00',
      endTime: '19:30',
      type: 'exercise'
    },
    {
      id: '3',
      title: '英语课程',
      description: '口语练习',
      date: new Date(2025, 0, 17),
      startTime: '19:00',
      endTime: '20:00',
      type: 'study'
    }
  ]);
  
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    type: 'work' as EventType
  });

  const getCurrentTime = () => {
    return format(new Date(), 'HH:mm', { locale: zhCN });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleAddEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      date: selectedDate || newEvent.date
    };
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      startTime: '',
      endTime: '',
      type: 'work'
    });
    setIsAddEventOpen(false);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent({ ...newEvent, date });
    setIsAddEventOpen(true);
  };

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const days = getDaysInMonth(currentDate);
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Sidebar - Upcoming Events */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-800 font-semibold mx-[25px] my-[135px]">即将到来的活动</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="group p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={eventColors[event.type]} variant="outline">
                          {eventTypeLabels[event.type]}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {format(event.date, 'MM月dd日')}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="text-sm font-medium text-gray-700">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>编辑</DropdownMenuItem>
                        <DropdownMenuItem>删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-gray-500 text-center py-8">暂无即将到来的活动</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Main Area - Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            {/* Header */}
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">我的日程</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{getCurrentTime()}</span>
                    <Cloud className="h-4 w-4" />
                    <span>30.2°C 北京</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-medium">
                    {format(currentDate, 'yyyy年 M月')}
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('month')}
                    className={viewMode === 'month' ? 'bg-purple-600 text-white' : ''}
                  >
                    月
                  </Button>
                  <Button
                    variant={viewMode === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('day')}
                    className={viewMode === 'day' ? 'bg-purple-600 text-white' : ''}
                  >
                    单日视图
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-white rounded-lg overflow-hidden border">
                {/* Week headers */}
                <div className="grid grid-cols-7 bg-gray-100">
                  {weekDays.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7">
                  {days.map((day, index) => {
                    const dayEvents = day ? getEventsForDate(day) : [];
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-24 p-2 border-r border-b border-gray-200 last:border-r-0 ${
                          day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'
                        } ${isToday ? 'bg-blue-50' : ''}`}
                        onClick={() => day && handleDateClick(day)}
                      >
                        {day && (
                          <>
                            <div className={`text-sm mb-1 ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded text-center ${eventColors[event.type]}`}
                                >
                                  <div className="font-medium truncate">{event.title}</div>
                                  <div className="text-xs">{event.startTime}-{event.endTime}</div>
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{dayEvents.length - 2} 更多
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加新的日程事件</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="输入事件标题"
              />
            </div>
            
            <div>
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="输入事件描述"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">开始时间</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">结束时间</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type">日程类型</Label>
              <Select value={newEvent.type} onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">工作</SelectItem>
                  <SelectItem value="study">学习</SelectItem>
                  <SelectItem value="exercise">运动</SelectItem>
                  <SelectItem value="entertainment">娱乐</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleAddEvent}
                disabled={!newEvent.title || !newEvent.startTime || !newEvent.endTime}
              >
                添加事件
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
