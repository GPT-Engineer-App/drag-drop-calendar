import React, { useState } from 'react';
import { Box, Container, Heading, VStack, HStack, Text, Select } from '@chakra-ui/react';
import { FaGripLines } from 'react-icons/fa';
import { addDays, startOfWeek, format } from 'date-fns';

const Index = () => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Meeting 1', start: 10, duration: 1, day: 0 },
    { id: 2, title: 'Appointment', start: 14, duration: 2, day: 1 },
  ]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => (i + 7) % 24);

  const handleDragStart = (e, eventId) => {
    e.dataTransfer.setData('text/plain', eventId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, hour, day) => {
    e.preventDefault();
    const eventId = parseInt(e.dataTransfer.getData('text'));
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, start: hour, day } : event
    );
    setEvents(updatedEvents);
  };

  const handleResize = (eventId, newDuration) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, duration: newDuration } : event
    );
    setEvents(updatedEvents);
  };

  const startOfSelectedWeek = startOfWeek(new Date(selectedYear, selectedMonth, 1), { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfSelectedWeek, i + selectedWeek * 7));

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>Calendar App</Heading>
      <HStack mb={5} spacing={3}>
        <Select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
        <Select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i).map(month => (
            <option key={month} value={month}>{format(new Date(0, month), 'MMMM')}</option>
          ))}
        </Select>
        <Select value={selectedWeek} onChange={(e) => setSelectedWeek(parseInt(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => i).map(week => (
            <option key={week} value={week}>Week {week + 1}</option>
          ))}
        </Select>
      </HStack>
      <HStack align="stretch" spacing={0}>
        <VStack width="100px" borderRight="1px solid" borderColor="gray.200" pr={2}>
          {hours.map(hour => (
            <Box key={hour} height="60px" width="100%" textAlign="right">
              {hour}:00
            </Box>
          ))}
        </VStack>
        {daysOfWeek.map((day, dayIndex) => (
          <Box key={dayIndex} flex={1} position="relative" borderLeft="1px solid" borderColor="gray.200">
            <Box textAlign="center" borderBottom="1px solid" borderColor="gray.200" py={2}>
              <Text fontWeight="bold">{format(day, 'EEEE')}</Text>
              <Text>{format(day, 'd')}</Text>
            </Box>
            {hours.map(hour => (
              <Box 
                key={hour} 
                height="60px" 
                borderBottom="1px solid" 
                borderColor="gray.200"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, hour, dayIndex)}
              />
            ))}
            {events.filter(event => event.day === dayIndex).map(event => (
              <Box
                key={event.id}
                position="absolute"
                left={0}
                top={`${(event.start - 7) * 60}px`}
                width="100%"
                height={`${event.duration * 60}px`}
                bg="blue.100"
                border="1px solid"
                borderColor="blue.500"
                borderRadius="md"
                p={2}
                draggable
                onDragStart={(e) => handleDragStart(e, event.id)}
              >
                <Text fontWeight="bold">{event.title}</Text>
                <Box 
                  position="absolute" 
                  bottom={0} 
                  left={0} 
                  right={0} 
                  height="10px" 
                  cursor="ns-resize"
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startHeight = event.duration * 60;
                    const handleMouseMove = (moveEvent) => {
                      const diff = moveEvent.clientY - startY;
                      const newDuration = Math.max(1, Math.round((startHeight + diff) / 60));
                      handleResize(event.id, newDuration);
                    };
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  <FaGripLines />
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </HStack>
    </Container>
  );
};

export default Index;