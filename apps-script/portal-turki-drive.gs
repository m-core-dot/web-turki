const CONFIG = {
  rootFolderId: '1taZrENGrjSePV-TBOVMhzPDN3Qw8hfDB',
  token: 'REPLACE_WITH_A_LONG_RANDOM_TOKEN',
};

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents || '{}');
    if (request.token !== CONFIG.token) return json({ ok: false, message: 'Unauthorized' });
    if (request.operation === 'make_public' && request.fileId) {
      const existingFile = DriveApp.getFileById(request.fileId);
      existingFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return json({ ok: true, fileId: existingFile.getId() });
    }
    if (request.operation === 'move_file' && request.fileId) {
      if (!request.targetRegistrationNumber || !request.targetStudentName || !request.batch) {
        return json({ ok: false, message: 'Target participant fields are missing' });
      }
      const file = DriveApp.getFileById(request.fileId);
      const root = DriveApp.getFolderById(CONFIG.rootFolderId);
      const batchFolder = getOrCreateFolder(root, String(request.batch));
      const participantFolder = getOrCreateFolder(batchFolder, `${sanitize(request.targetRegistrationNumber)}-${sanitize(request.targetStudentName)}`);
      const categoryFolder = getOrCreateFolder(participantFolder, categoryLabel(request.category || 'bukti_pembayaran'));
      file.moveTo(categoryFolder);
      file.setName(sanitize(request.fileName || file.getName()));
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return json({ ok: true, fileId: file.getId(), fileName: file.getName(), webViewLink: `https://drive.google.com/open?id=${file.getId()}` });
    }
    if (!request.registrationNumber || !request.studentName || !request.batch || !request.fileName || !request.base64) {
      return json({ ok: false, message: 'Required fields are missing' });
    }

    const root = DriveApp.getFolderById(CONFIG.rootFolderId);
    const batchFolder = getOrCreateFolder(root, String(request.batch));
    const participantFolder = getOrCreateFolder(batchFolder, `${sanitize(request.registrationNumber)}-${sanitize(request.studentName)}`);
    const categoryFolder = getOrCreateFolder(participantFolder, categoryLabel(request.category));
    const bytes = Utilities.base64Decode(request.base64);
    const blob = Utilities.newBlob(bytes, request.mimeType || MimeType.OCTET_STREAM, sanitize(request.fileName));
    const file = categoryFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return json({ ok: true, fileId: file.getId(), fileName: file.getName(), webViewLink: `https://drive.google.com/open?id=${file.getId()}` });
  } catch (error) {
    return json({ ok: false, message: error.message || 'Upload failed' });
  }
}

function getOrCreateFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function categoryLabel(category) {
  const labels = {
    bukti_pendaftaran: 'Bukti Pendaftaran',
    dokumen_peserta: 'Dokumen Peserta',
    file_revisi: 'File Revisi',
    bukti_pembayaran: 'Bukti Pembayaran',
  };
  return labels[category] || 'Lainnya';
}

function sanitize(value) {
  return String(value).replace(/[\\/:*?"<>|#%{}~&]/g, '_').trim().slice(0, 120) || 'Tanpa Nama';
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
