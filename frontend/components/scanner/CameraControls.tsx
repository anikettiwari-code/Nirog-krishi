import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ArrowLeft, Zap, ZapOff, Camera as CameraIcon } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface CameraControlsProps {
    onBack: () => void;
    onFlashToggle: () => void;
    flash: boolean;
    isScanning: boolean;
    onCapture: () => void;
}

export const CameraControls = ({ onBack, onFlashToggle, flash, isScanning, onCapture }: CameraControlsProps) => {
    return (
        <View style={styles.overlay}>
            {/* Top Controls */}
            <View style={styles.topControls}>
                <TouchableOpacity onPress={onBack} style={styles.iconButton}>
                    <ArrowLeft color={COLORS.white} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onFlashToggle} style={styles.iconButton}>
                    {flash ? <Zap color={COLORS.warning} size={24} /> : <ZapOff color={COLORS.white} size={24} />}
                </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
                {isScanning && (
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar} />
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
                    onPress={onCapture}
                    disabled={isScanning}
                >
                    <CameraIcon color={COLORS.white} size={32} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: SPACING.lg,
    },
    iconButton: {
        padding: SPACING.sm,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: RADIUS.full,
    },
    bottomControls: {
        paddingBottom: 50,
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    captureButtonDisabled: {
        backgroundColor: COLORS.neutral600,
        opacity: 0.7
    },
    progressBarContainer: {
        width: 200,
        height: 6,
        backgroundColor: COLORS.neutral600,
        borderRadius: RADIUS.full,
        marginBottom: SPACING.xl,
        overflow: 'hidden'
    },
    progressBar: {
        height: '100%',
        width: '60%', // Mock progress
        backgroundColor: COLORS.primaryLight
    }
});
