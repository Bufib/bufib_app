import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SuraDetail = ({ sura, onBack, onShowVerses }) => {
  if (!sura) return null;

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sura Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Sura Title */}
          <View style={styles.titleSection}>
            <Text style={styles.arabicTitle}>{sura.arabicName}</Text>
            <Text style={styles.germanTitle}>{sura.germanName}</Text>
            <Text style={styles.englishTitle}>{sura.englishName}</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Sura Nr.</Text>
              <Text style={styles.statValue}>{sura.number}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Verse</Text>
              <Text style={styles.statValue}>{sura.verses}</Text>
            </View>
          </View>

          {/* Revelation Place */}
          <View style={styles.revelationCard}>
            <Text style={styles.revelationLabel}>Offenbarungsort</Text>
            <View style={[
              styles.revelationBadge,
              sura.revelationPlace === 'Mekka' ? styles.mekkaBadge : styles.medinaBadge
            ]}>
              <Text style={styles.revelationBadgeText}>{sura.revelationPlace}</Text>
            </View>
          </View>

          {/* Theme */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hauptthema</Text>
            <Text style={styles.themeText}>{sura.theme}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beschreibung</Text>
            <Text style={styles.descriptionText}>{sura.description}</Text>
          </View>

          {/* Key Topics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schlüsselthemen</Text>
            <View style={styles.topicsContainer}>
              {sura.keyTopics.map((topic, index) => (
                <View key={index} style={styles.topicTag}>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Read Verses Button */}
          <TouchableOpacity style={styles.readButton} onPress={onShowVerses}>
            <Text style={styles.readButtonText}>📖 Verse lesen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#065f46',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  arabicTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 8,
  },
  germanTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 4,
  },
  englishTitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#d1fae5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#065f46',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065f46',
  },
  revelationCard: {
    backgroundColor: '#d1fae5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  revelationLabel: {
    fontSize: 12,
    color: '#065f46',
    marginBottom: 8,
  },
  revelationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mekkaBadge: {
    backgroundColor: '#065f46',
  },
  medinaBadge: {
    backgroundColor: '#6b7280',
  },
  revelationBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 12,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#047857',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicTag: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    fontSize: 12,
    color: '#065f46',
  },
  readButton: {
    backgroundColor: '#065f46',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  readButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SuraDetail;