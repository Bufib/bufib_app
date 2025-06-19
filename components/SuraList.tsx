import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SuraList = ({ suras, onSuraSelect }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.arabicTitle}>القرآن الكريم</Text>
        <Text style={styles.germanTitle}>Der Heilige Koran</Text>
        <Text style={styles.subtitle}>
          Tippen Sie auf eine Sura für Details
        </Text>
      </View>

      {/* Suras List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {suras.map((sura) => (
            <TouchableOpacity
              key={sura.number}
              style={styles.suraCard}
              onPress={() => onSuraSelect(sura)}
              activeOpacity={0.7}
            >
              <View style={styles.suraContent}>
                <View style={styles.leftContent}>
                  <View style={styles.numberCircle}>
                    <Text style={styles.numberText}>{sura.number}</Text>
                  </View>
                  <View style={styles.suraInfo}>
                    <Text style={styles.arabicName}>{sura.arabicName}</Text>
                    <Text style={styles.germanName}>{sura.germanName}</Text>
                  </View>
                </View>
                <View style={styles.rightContent}>
                  <View style={[
                    styles.badge,
                    sura.revelationPlace === 'Mekka' ? styles.mekkaBadge : styles.medinaBadge
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      sura.revelationPlace === 'Mekka' ? styles.mekkaText : styles.medinaText
                    ]}>
                      {sura.revelationPlace}
                    </Text>
                  </View>
                  <Text style={styles.versesText}>{sura.verses} Verse</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  arabicTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  germanTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d1fae5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a7f3d0',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  suraCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suraContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
  },
  suraInfo: {
    flex: 1,
  },
  arabicName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  germanName: {
    fontSize: 14,
    color: '#6b7280',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  mekkaBadge: {
    backgroundColor: '#065f46',
  },
  medinaBadge: {
    backgroundColor: '#6b7280',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  mekkaText: {
    color: '#ffffff',
  },
  medinaText: {
    color: '#ffffff',
  },
  versesText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default SuraList;