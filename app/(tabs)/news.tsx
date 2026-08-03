import { Ionicons } from '@expo/vector-icons';
import { FlatList, Text, View } from 'react-native';
import { styles } from './news.styles';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  body: string;
}

const NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Новое оборудование для диагностики',
    date: '01.08.2026',
    body: 'В нашей клинике появился современный 3D-томограф — диагностика стала ещё точнее и быстрее.',
  },
  {
    id: '2',
    title: 'Акция на профессиональную гигиену',
    date: '25.07.2026',
    body: 'Весь август — скидка 20% на профессиональную чистку зубов для новых пациентов.',
  },
  {
    id: '3',
    title: 'Открыта запись к новому ортодонту',
    date: '18.07.2026',
    body: 'Теперь консультации по брекет-системам проводит врач с 10-летним стажем.',
  },
];

export default function NewsScreen() {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={NEWS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="newspaper-outline" size={20} color="#007AFF" />
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
      )}
    />
  );
}
