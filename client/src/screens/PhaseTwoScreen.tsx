import React from 'react';
import { Equipment } from '../types/game';
import './Screens.css';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { sound } from '../audio/soundEffects';

interface PhaseTwoScreenProps {
  equipmentList: Equipment[];
  equippedIds: string[];
  testedCardId: string | null;
  onSelectCard: (id: string) => void;
  onContinue: () => void;
}

export const PhaseTwoScreen: React.FC<PhaseTwoScreenProps> = ({
  equipmentList,
  equippedIds,
  testedCardId,
  onSelectCard,
  onContinue
}) => {
  const hasCofre = equippedIds.includes('cofre');
  const hasLista = equippedIds.includes('lista');

  const handleContinue = () => {
    sound.playClick();
    onContinue();
  };

  return (
    <div className="stage">
      <h2 className="stage-title">FASE 2 — ESCOLHA O EQUIPAMENTO</h2>
      <p className="stage-sub">
        Antes de reenviar o sinal, equipe uma carta de melhoria. Toque em cada uma para ver o que o Agente V ainda consegue fazer.
      </p>

      <EquipmentGrid
        equipmentList={equipmentList}
        equippedIds={equippedIds}
        testedCardId={testedCardId}
        onSelectCard={onSelectCard}
      />

      {hasCofre && (
        <button
          className="btn"
          style={{ marginTop: '28px' }}
          onClick={handleContinue}
        >
          {hasCofre && hasLista ? 'REENVIAR COM COFRE + LISTA' : 'REENVIAR COM O COFRE'}
        </button>
      )}
    </div>
  );
};
