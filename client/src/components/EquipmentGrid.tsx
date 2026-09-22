import React from 'react';
import { Equipment } from '../types/game';
import { sound } from '../audio/soundEffects';
import { Shield, Rocket, ClipboardList, Lock, HelpCircle } from 'lucide-react';
import './EquipmentGrid.css';

interface EquipmentGridProps {
  equipmentList: Equipment[];
  equippedIds: string[];
  testedCardId: string | null;
  onSelectCard: (id: string) => void;
}

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'shield': return <Shield size={34} strokeWidth={1.5} />;
    case 'rocket': return <Rocket size={34} strokeWidth={1.5} />;
    case 'clipboard': return <ClipboardList size={34} strokeWidth={1.5} />;
    case 'lock': return <Lock size={34} strokeWidth={1.5} />;
    default: return <HelpCircle size={34} strokeWidth={1.5} />;
  }
};

export const EquipmentGrid: React.FC<EquipmentGridProps> = ({
  equipmentList,
  equippedIds,
  testedCardId,
  onSelectCard
}) => {
  return (
    <div className="cards-grid">
      {equipmentList.map((item) => {
        const isEquipped = equippedIds.includes(item.id);
        const isCofre = item.id === 'cofre';
        const isLista = item.id === 'lista';
        const isTested = testedCardId === item.id;

        let statusClass = '';
        if (isEquipped) {
          statusClass = 'equipped correct';
        } else if (isTested) {
          statusClass = isCofre ? 'correct' : (isLista ? 'partial' : 'partial');
        }

        return (
          <div
            key={item.id}
            className={`card ${statusClass}`}
            onClick={() => {
              if (item.id === 'cofre' || item.id === 'lista') {
                sound.playCardEquip();
              } else {
                sound.playClick();
              }
              onSelectCard(item.id);
            }}
          >
            <div className="cicon">{renderIcon(item.icon)}</div>
            <div className="cname">{item.name}</div>
            <div className="cdesc">{item.desc}</div>
            <div className="ctag">{item.pillar}</div>
          </div>
        );
      })}
    </div>
  );
};
