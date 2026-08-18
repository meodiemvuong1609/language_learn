from django.db.models.signals import pre_save
from django.dispatch import receiver

from account.middleware import get_current_user

from .models import BaseModel


@receiver(pre_save)
def set_created_updated_by(sender, instance, **kwargs):
    """
    Tự động set created_by / updated_by cho các model kế thừa BaseModel.
    Hoạt động khi request chạy qua ViewSet (user được middleware lưu vào
    thread-local `account.middleware._thread_locals`).
    """
    # Chỉ áp dụng cho các model kế thừa BaseModel (bỏ qua model khác, kể cả
    # bảng của bên thứ ba như authtoken/session để tránh xử lý thừa).
    if not isinstance(instance, BaseModel):
        return

    # Lấy user hiện tại từ thread-local do CurrentUserMiddleware thiết lập.
    user = get_current_user()

    if user is not None and getattr(user, "is_authenticated", False):
        if instance._state.adding and instance.created_by_id is None:
            instance.created_by = user
        instance.updated_by = user
