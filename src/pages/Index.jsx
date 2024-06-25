import React, { useState } from 'react';
import { Box, Container, Heading, VStack, HStack, Text } from '@chakra-ui/react';
import { FaGripLines } from 'react-icons/fa';

const Index = () => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Meeting 1', start: 9, duration: 1 },
    { id: 2, title: 'Appointment', start: 14, duration: 2 },
  ]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDragStart = (e, eventId) => {
    e.dataTransfer.setData('text/plain', eventId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, hour) => {
    e.preventDefault();
    const eventId = parseInt(e.dataTransfer.getData('text'));
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, start: hour } : event
    );
    setEvents(updatedEvents);
  };

  const handleResize = (eventId, newDuration) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, duration: newDuration } : event
    );
    setEvents(updatedEvents);
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>Calendar App</Heading>
      <HStack align="stretch" spacing={0}>
        <VStack width="100px" borderRight="1px solid" borderColor="gray.200" pr={2}>
          {hours.map(hour => (
            <Box key={hour} height="60px" width="100%" textAlign="right">
              {hour}:00
            </Box>
          ))}
        </VStack>
        <Box flex={1} position="relative">
          {hours.map(hour => (
            <Box 
              key={hour} 
              height="60px" 
              borderBottom="1px solid" 
              borderColor="gray.200"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, hour)}
            />
          ))}
          {events.map(event => (
            <Box
              key={event.id}
              position="absolute"
              left={0}
              top={`${event.start * 60}px`}
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
      </HStack>
    </Container>
  );
};

export default Index;