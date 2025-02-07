export default function RestrictedAccess() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: 'red' }}>
                You need to log in to access this feature.
            </Text>
        </View>
    );
}