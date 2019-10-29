module.exports = {
  objects: [],

  resolve (Target) {
    let existing = this.objects.find((ref) => ref instanceof Target)
    if (!existing) {
      this.objects.push(existing = new Target())
    }
    return existing
  }
}
