SAMPLE_RATE = 44100

note_names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

def get_id_within_octave(note_id):
    mId = note_id - 21
    return mId % 12


def get_octave_num(note_id):
    mId = note_id - 21
    return mId // 12


def get_octave_num_and_id(note_id):
    mId = note_id - 21
    return mId // 12, mId % 12


def midi_note_id_to_string(note_id):
    mNum, mInOct = get_octave_num_and_id(note_id)
    return note_names[mInOct] + " " + str(mNum)