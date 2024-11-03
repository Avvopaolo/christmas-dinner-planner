'use client'import React, { useState } from 'react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, User } from 'lucide-react';

export default function ChristmasDinnerPlanner() {
  const [name, setName] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [allResponses, setAllResponses] = useState([]);

  // Genera array di date dal 1 al 23 dicembre 2024
  const decemberDates = Array.from({ length: 23 }, (_, i) => new Date(2024, 11, i + 1));

  const handleSubmitName = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setShowCalendar(true);
    }
  };

  const toggleDate = (date) => {
    if (unavailableDates.includes(date)) {
      setUnavailableDates(unavailableDates.filter(d => d !== date));
    } else {
      setUnavailableDates([...unavailableDates, date]);
    }
  };

  const handleSubmitDates = () => {
    const response = {
      name,
      unavailableDates: [...unavailableDates]
    };
    setAllResponses([...allResponses, response]);
    setName('');
    setUnavailableDates([]);
    setShowCalendar(false);
  };

  const getBestDates = () => {
    const dateAvailability = {};
    decemberDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      const availablePeople = allResponses.filter(
        response => !response.unavailableDates.includes(dateStr)
      );
      dateAvailability[dateStr] = {
        count: availablePeople.length,
        people: availablePeople.map(p => p.name)
      };
    });

    return Object.entries(dateAvailability)
      .sort(([, a], [, b]) => b.count - a.count);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!showCalendar ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Inserisci il tuo nome
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitName} className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome e Cognome"
                className="flex-1"
              />
              <Button type="submit">Continua</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seleziona i giorni in cui NON sei disponibile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {decemberDates.map(date => (
                <Button
                  key={date.toISOString()}
                  variant={unavailableDates.includes(date.toISOString().split('T')[0]) ? "destructive" : "outline"}
                  className="h-12"
                  onClick={() => toggleDate(date.toISOString().split('T')[0])}
                >
                  {date.getDate()}
                </Button>
              ))}
            </div>
            <Button onClick={handleSubmitDates} className="w-full">
              Conferma disponibilità
            </Button>
          </CardContent>
        </Card>
      )}

      {allResponses.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Riepilogo Disponibilità</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getBestDates().map(([date, info]) => (
                <div key={date} className="p-2 border rounded">
                  <div className="font-medium">
                    {new Date(date).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    Disponibili: {info.count} persone
                  </div>
                  <div className="text-sm text-gray-600">
                    Partecipanti: {info.people.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}