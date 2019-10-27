module.exports = {
  objects: [],

  resolve(target) {
    let existing = this.objects.find(ref => ref instanceof target);
    if (!existing) {
      this.objects.push(existing = new target())
    }
    return existing;
  }
};
